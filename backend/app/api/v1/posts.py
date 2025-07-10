from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy import desc
import re

from app import db
from app.models.post import Post, Tag, Comment
from app.models.user import User
from app.schemas.post import PostSchema, PostDetailSchema, PostCreateSchema, CommentSchema, TagSchema

posts_bp = Blueprint('posts', __name__)
post_schema = PostSchema()
post_detail_schema = PostDetailSchema()
post_create_schema = PostCreateSchema()
comment_schema = CommentSchema()
tag_schema = TagSchema()

def slugify(text):
    """Convert text to slug format"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

@posts_bp.route('/', methods=['GET'])
def get_posts():
    """Get all posts with pagination and filtering"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    tag = request.args.get('tag')
    search = request.args.get('search')
    
    # Base query
    query = Post.query
    
    # Apply filters
    if tag:
        tag_obj = Tag.query.filter_by(name=tag).first()
        if tag_obj:
            query = query.filter(Post.tags.contains(tag_obj))
    
    if search:
        query = query.filter(
            (Post.title.ilike(f'%{search}%')) | 
            (Post.subtitle.ilike(f'%{search}%')) | 
            (Post.body.ilike(f'%{search}%'))
        )
    
    # Only show published posts to non-authors
    if not request.args.get('show_all'):
        query = query.filter_by(is_published=True)
    
    # Order by creation date, newest first
    query = query.order_by(desc(Post.created_at))
    
    # Paginate
    posts_page = query.paginate(page=page, per_page=per_page)
    
    # Prepare response
    result = {
        "posts": post_schema.dump(posts_page.items, many=True),
        "pagination": {
            "total": posts_page.total,
            "pages": posts_page.pages,
            "page": page,
            "per_page": per_page,
            "has_next": posts_page.has_next,
            "has_prev": posts_page.has_prev
        }
    }
    
    return jsonify(result), 200


@posts_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Get a specific post with comments"""
    post = Post.query.get_or_404(post_id)
    
    # Increment view count
    post.views_count += 1
    db.session.commit()
    
    return jsonify(post_detail_schema.dump(post)), 200


@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    """Create a new post"""
    try:
        post_data = post_create_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    
    # Generate slug from title
    base_slug = slugify(post_data['title'])
    slug = base_slug
    counter = 1
    
    # Ensure slug is unique
    while Post.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Create new post
    new_post = Post(
        title=post_data['title'],
        subtitle=post_data.get('subtitle', ''),
        body=post_data['body'],
        featured_image=post_data.get('featured_image', ''),
        slug=slug,
        is_published=post_data.get('is_published', True),
        user_id=current_user_id
    )
    
    # Handle tags
    if 'tags' in post_data and post_data['tags']:
        for tag_name in post_data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            new_post.tags.append(tag)
    
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify({
        "message": "Post created successfully",
        "post": post_schema.dump(new_post)
    }), 201


@posts_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """Update a post"""
    post = Post.query.get_or_404(post_id)
    current_user_id = get_jwt_identity()
    
    # Check if user is the author
    if post.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    try:
        post_data = post_create_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Update post fields
    for key, value in post_data.items():
        if key != 'tags':
            setattr(post, key, value)
    
    # Update slug if title changed
    if 'title' in post_data:
        base_slug = slugify(post_data['title'])
        slug = base_slug
        counter = 1
        
        # Ensure slug is unique
        while Post.query.filter(Post.slug == slug, Post.id != post_id).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        post.slug = slug
    
    # Update tags
    if 'tags' in post_data:
        # Clear existing tags
        post.tags = []
        
        # Add new tags
        for tag_name in post_data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            post.tags.append(tag)
    
    db.session.commit()
    
    return jsonify({
        "message": "Post updated successfully",
        "post": post_schema.dump(post)
    }), 200


@posts_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """Delete a post"""
    post = Post.query.get_or_404(post_id)
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Check if user is the author or admin
    if post.user_id != current_user_id and not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"message": "Post deleted successfully"}), 200


@posts_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    """Add a comment to a post"""
    post = Post.query.get_or_404(post_id)
    current_user_id = get_jwt_identity()
    
    try:
        comment_data = comment_schema.load(request.json, partial=('post_id', 'user_id'))
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Create new comment
    new_comment = Comment(
        body=comment_data['body'],
        post_id=post_id,
        user_id=current_user_id,
        parent_id=comment_data.get('parent_id')
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({
        "message": "Comment added successfully",
        "comment": comment_schema.dump(new_comment)
    }), 201


@posts_bp.route('/comments/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id):
    """Update a comment"""
    comment = Comment.query.get_or_404(comment_id)
    current_user_id = get_jwt_identity()
    
    # Check if user is the author
    if comment.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    try:
        comment_data = comment_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Update comment
    comment.body = comment_data['body']
    db.session.commit()
    
    return jsonify({
        "message": "Comment updated successfully",
        "comment": comment_schema.dump(comment)
    }), 200


@posts_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    """Delete a comment"""
    comment = Comment.query.get_or_404(comment_id)
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Check if user is the author, post author, or admin
    if (comment.user_id != current_user_id and 
        comment.post.user_id != current_user_id and 
        not current_user.is_admin):
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({"message": "Comment deleted successfully"}), 200


@posts_bp.route('/tags', methods=['GET'])
def get_tags():
    """Get all tags"""
    tags = Tag.query.all()
    return jsonify(tag_schema.dump(tags, many=True)), 200