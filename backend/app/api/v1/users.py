from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app import db
from app.models.user import User
from app.schemas.user import UserSchema, UserUpdateSchema

users_bp = Blueprint('users', __name__)
user_schema = UserSchema()
user_update_schema = UserUpdateSchema()

@users_bp.route('/', methods=['GET'])
def get_users():
    """Get all users"""
    users = User.query.all()
    return jsonify(UserSchema(many=True, only=('id', 'username', 'profile_image')).dump(users)), 200


@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user"""
    user = User.query.get_or_404(user_id)
    return jsonify(user_schema.dump(user)), 200


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    try:
        user_data = user_update_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Update user fields
    for key, value in user_data.items():
        setattr(user, key, value)
    
    db.session.commit()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user": user_schema.dump(user)
    }), 200


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Delete a user (admin or self only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get_or_404(current_user_id)
    
    # Check if user is admin or deleting their own account
    if not current_user.is_admin and current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User deleted successfully"}), 200