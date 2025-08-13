'use client';

import { useState, useEffect } from 'react';
import { Comment, Reaction } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useAuth } from '../providers/AuthProvider';
import { api } from '@/lib/api';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Edit, 
  Trash2,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.getComments(postId);
      setComments(response.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (parentId?: string) => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await api.createComment({
        postId,
        content: newComment,
        parentId,
      });
      
      setNewComment('');
      setReplyingTo(null);
      fetchComments();
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await api.updateComment(commentId, { content: editContent });
      setEditingComment(null);
      setEditContent('');
      fetchComments();
      toast.success('Comment updated successfully!');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.deleteComment(commentId);
      fetchComments();
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    if (!user) {
      toast.error('Please login to react to comments');
      return;
    }

    try {
      await api.reactToComment(commentId, type);
      fetchComments(); // Refresh to get updated reactions
    } catch (error) {
      toast.error('Failed to update reaction');
    }
  };

  const renderComment = (comment: Comment, level = 0) => {
    const canEdit = user && (user.id === comment.userId || ['admin', 'editor'].includes(user.role));
    const canDelete = user && (user.id === comment.userId || ['admin', 'editor'].includes(user.role));

    return (
      <div key={comment.id} className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">
                  {comment.authorName || 'Anonymous'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment..."
                    className="mb-2"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleReaction(comment.id, 'like')}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Like</span>
                    </button>
                    <button
                      onClick={() => handleReaction(comment.id, 'dislike')}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Dislike</span>
                    </button>
                    
                    {user && (
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600"
                      >
                        <Reply className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                    )}

                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="ml-8 mb-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleSubmitComment(comment.id)}
              >
                Reply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Nested Comments */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          Comments
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="h-6 w-6 mr-2" />
        Comments ({comments.length})
      </h2>

      {/* New Comment Form */}
      {user ? (
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add a comment</h3>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="mb-4"
            rows={4}
          />
          <Button onClick={() => handleSubmitComment()}>
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-600 mb-4">Please login to leave a comment</p>
          <Link href="/login">
            <Button>
              Login to Comment
            </Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
