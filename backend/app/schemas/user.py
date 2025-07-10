from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models.user import User

class UserSchema(Schema):
    """Schema for User model"""
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    first_name = fields.Str()
    last_name = fields.Str()
    bio = fields.Str()
    profile_image = fields.Str()
    is_active = fields.Bool(dump_only=True)
    is_admin = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
    @validates('username')
    def validate_username(self, value):
        user = User.query.filter_by(username=value).first()
        if user:
            raise ValidationError('Username already exists.')
    
    @validates('email')
    def validate_email(self, value):
        user = User.query.filter_by(email=value).first()
        if user:
            raise ValidationError('Email already exists.')


class UserUpdateSchema(Schema):
    """Schema for updating User model"""
    email = fields.Email()
    username = fields.Str(validate=validate.Length(min=3, max=50))
    first_name = fields.Str()
    last_name = fields.Str()
    bio = fields.Str()
    profile_image = fields.Str()
    
    @validates('username')
    def validate_username(self, value, **kwargs):
        user_id = kwargs.get('id')
        user = User.query.filter_by(username=value).first()
        if user and user.id != user_id:
            raise ValidationError('Username already exists.')
    
    @validates('email')
    def validate_email(self, value, **kwargs):
        user_id = kwargs.get('id')
        user = User.query.filter_by(email=value).first()
        if user and user.id != user_id:
            raise ValidationError('Email already exists.')


class UserLoginSchema(Schema):
    """Schema for user login"""
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


class PasswordChangeSchema(Schema):
    """Schema for password change"""
    current_password = fields.Str(required=True, load_only=True)
    new_password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    confirm_password = fields.Str(required=True, load_only=True)
    
    @validates('confirm_password')
    def validate_confirm_password(self, value, **kwargs):
        if value != kwargs.get('new_password'):
            raise ValidationError('Passwords do not match.')