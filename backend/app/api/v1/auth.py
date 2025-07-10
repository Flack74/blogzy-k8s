from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, get_jwt
)
from marshmallow import ValidationError

from app import db
from app.models.user import User
from app.schemas.user import UserSchema, UserLoginSchema, PasswordChangeSchema

auth_bp = Blueprint('auth', __name__)
user_schema = UserSchema()
login_schema = UserLoginSchema()
password_schema = PasswordChangeSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        user_data = user_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Create new user
    new_user = User(
        email=user_data['email'],
        username=user_data['username'],
        first_name=user_data.get('first_name', ''),
        last_name=user_data.get('last_name', '')
    )
    new_user.password = user_data['password']
    
    # Save to database
    db.session.add(new_user)
    db.session.commit()
    
    # Create tokens
    access_token = create_access_token(identity=new_user.id)
    refresh_token = create_refresh_token(identity=new_user.id)
    
    return jsonify({
        "message": "User registered successfully",
        "user": user_schema.dump(new_user),
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        login_data = login_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    # Find user by email
    user = User.query.filter_by(email=login_data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not user.verify_password(login_data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Check if user is active
    if not user.is_active:
        return jsonify({"error": "Account is deactivated"}), 401
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        "message": "Login successful",
        "user": user_schema.dump(user),
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        "access_token": access_token
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user info"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user_schema.dump(user)), 200


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        password_data = password_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Verify current password
    if not user.verify_password(password_data['current_password']):
        return jsonify({"error": "Current password is incorrect"}), 401
    
    # Update password
    user.password = password_data['new_password']
    db.session.commit()
    
    return jsonify({"message": "Password changed successfully"}), 200