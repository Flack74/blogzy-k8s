from marshmallow import Schema, fields, validate
from app.schemas.user import UserSchema

class TagSchema(Schema):
    """Schema for Tag model"""
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=50))


class CommentSchema(Schema):
    """Schema for Comment model"""
    id = fields.Int(dump_only=True)
    body = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    post_id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    parent_id = fields.Int(allow_none=True)
    author = fields.Nested(UserSchema(only=('id', 'username', 'profile_image')), dump_only=True)
    replies = fields.List(fields.Nested(lambda: CommentSchema(exclude=('replies',))), dump_only=True)


class PostSchema(Schema):
    """Schema for Post model"""
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    subtitle = fields.Str(validate=validate.Length(max=255))
    body = fields.Str(required=True)
    featured_image = fields.Str()
    slug = fields.Str(dump_only=True)
    is_published = fields.Bool()
    views_count = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    user_id = fields.Int(dump_only=True)
    author = fields.Nested(UserSchema(only=('id', 'username', 'profile_image')), dump_only=True)
    tags = fields.List(fields.Nested(TagSchema), dump_only=True)
    comments_count = fields.Method("get_comments_count", dump_only=True)
    
    def get_comments_count(self, obj):
        return obj.comments.count()


class PostDetailSchema(PostSchema):
    """Schema for Post detail with comments"""
    comments = fields.List(fields.Nested(CommentSchema(exclude=('post_id',))), dump_only=True)


class PostCreateSchema(Schema):
    """Schema for creating a Post"""
    title = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    subtitle = fields.Str(validate=validate.Length(max=255))
    body = fields.Str(required=True)
    featured_image = fields.Str()
    is_published = fields.Bool(default=True)
    tags = fields.List(fields.Str(), required=False)