"""Initial migration

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('ign', sa.String(length=100), nullable=True),
        sa.Column('current_rank', sa.String(length=50), nullable=True),
        sa.Column('main_heroes', sa.JSON(), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # Create heroes table
    op.create_table('heroes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('specialty', sa.String(length=100), nullable=False),
        sa.Column('lane', sa.JSON(), nullable=True),
        sa.Column('durability', sa.Integer(), nullable=True),
        sa.Column('offense', sa.Integer(), nullable=True),
        sa.Column('control', sa.Integer(), nullable=True),
        sa.Column('difficulty', sa.Integer(), nullable=True),
        sa.Column('passive_skill', sa.JSON(), nullable=True),
        sa.Column('first_skill', sa.JSON(), nullable=True),
        sa.Column('second_skill', sa.JSON(), nullable=True),
        sa.Column('ultimate_skill', sa.JSON(), nullable=True),
        sa.Column('release_date', sa.String(length=50), nullable=True),
        sa.Column('price', sa.JSON(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('win_rate', sa.Float(), nullable=True),
        sa.Column('pick_rate', sa.Float(), nullable=True),
        sa.Column('ban_rate', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_heroes_id'), 'heroes', ['id'], unique=False)
    op.create_index(op.f('ix_heroes_name'), 'heroes', ['name'], unique=True)

    # Create items table
    op.create_table('items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Integer(), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=True),
        sa.Column('stats', sa.JSON(), nullable=True),
        sa.Column('passive_effect', sa.JSON(), nullable=True),
        sa.Column('active_effect', sa.JSON(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_items_id'), 'items', ['id'], unique=False)
    op.create_index(op.f('ix_items_name'), 'items', ['name'], unique=True)

    # Create emblems table
    op.create_table('emblems',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('level', sa.Integer(), nullable=True),
        sa.Column('stats', sa.JSON(), nullable=True),
        sa.Column('talents', sa.JSON(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_emblems_id'), 'emblems', ['id'], unique=False)
    op.create_index(op.f('ix_emblems_name'), 'emblems', ['name'], unique=True)

    # Create build_guides table
    op.create_table('build_guides',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hero_id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('emblems', sa.JSON(), nullable=True),
        sa.Column('battle_spell', sa.String(length=100), nullable=True),
        sa.Column('item_build', sa.JSON(), nullable=True),
        sa.Column('skill_priority', sa.JSON(), nullable=True),
        sa.Column('play_style', sa.String(length=50), nullable=True),
        sa.Column('difficulty', sa.String(length=20), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('likes', sa.Integer(), nullable=True),
        sa.Column('rating', sa.Float(), nullable=True),
        sa.Column('rating_count', sa.Integer(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=True),
        sa.Column('version', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['hero_id'], ['heroes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_build_guides_id'), 'build_guides', ['id'], unique=False)

    # Create comments table
    op.create_table('comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('guide_id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.Column('likes', sa.Integer(), nullable=True),
        sa.Column('is_approved', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['guide_id'], ['build_guides.id'], ),
        sa.ForeignKeyConstraint(['parent_id'], ['comments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_comments_id'), 'comments', ['id'], unique=False)

    # Create guide_ratings table
    op.create_table('guide_ratings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('guide_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('review', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['guide_id'], ['build_guides.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_guide_ratings_id'), 'guide_ratings', ['id'], unique=False)

    # Create hero_counters table
    op.create_table('hero_counters',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hero_id', sa.Integer(), nullable=False),
        sa.Column('counter_hero_id', sa.Integer(), nullable=False),
        sa.Column('counter_type', sa.String(length=20), nullable=True),
        sa.Column('win_rate', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['counter_hero_id'], ['heroes.id'], ),
        sa.ForeignKeyConstraint(['hero_id'], ['heroes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hero_counters_id'), 'hero_counters', ['id'], unique=False)

    # Create hero_synergies table
    op.create_table('hero_synergies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hero_id', sa.Integer(), nullable=False),
        sa.Column('synergy_hero_id', sa.Integer(), nullable=False),
        sa.Column('synergy_type', sa.String(length=20), nullable=True),
        sa.Column('win_rate', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['hero_id'], ['heroes.id'], ),
        sa.ForeignKeyConstraint(['synergy_hero_id'], ['heroes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hero_synergies_id'), 'hero_synergies', ['id'], unique=False)

    # Create news table
    op.create_table('news',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_news_id'), 'news', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_news_id'), table_name='news')
    op.drop_table('news')
    op.drop_index(op.f('ix_hero_synergies_id'), table_name='hero_synergies')
    op.drop_table('hero_synergies')
    op.drop_index(op.f('ix_hero_counters_id'), table_name='hero_counters')
    op.drop_table('hero_counters')
    op.drop_index(op.f('ix_guide_ratings_id'), table_name='guide_ratings')
    op.drop_table('guide_ratings')
    op.drop_index(op.f('ix_comments_id'), table_name='comments')
    op.drop_table('comments')
    op.drop_index(op.f('ix_build_guides_id'), table_name='build_guides')
    op.drop_table('build_guides')
    op.drop_index(op.f('ix_emblems_name'), table_name='emblems')
    op.drop_index(op.f('ix_emblems_id'), table_name='emblems')
    op.drop_table('emblems')
    op.drop_index(op.f('ix_items_name'), table_name='items')
    op.drop_index(op.f('ix_items_id'), table_name='items')
    op.drop_table('items')
    op.drop_index(op.f('ix_heroes_name'), table_name='heroes')
    op.drop_index(op.f('ix_heroes_id'), table_name='heroes')
    op.drop_table('heroes')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')