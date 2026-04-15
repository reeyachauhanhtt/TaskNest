import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '../../hooks/useUser';
import classes from './TaskCommentsModal.module.css';
import useAuth from '../../hooks/Authentication';

import { getCommentsByTask, addComment } from '../../services/commentsService';
import {
  createActivity,
  getActivitiesByTask,
} from '../../services/activityService';

export default function TaskCommentsModal({ task, onClose }) {
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsers();

  const safeUsers = Array.isArray(users)
    ? users
    : Array.isArray(users?.data)
      ? users.data
      : Array.isArray(users?.users)
        ? users.users
        : [];

  //  COMMENTS QUERY
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', task.id],
    queryFn: () => getCommentsByTask(task.id),
    refetchInterval: 3000,
  });

  //  ACTIVITIES QUERY
  const { data: activities = [] } = useQuery({
    queryKey: ['activities', task.id],
    queryFn: () => getActivitiesByTask(task.id),
    refetchInterval: 3000,
  });

  //  COMBINED FEED
  const combinedFeed = [
    ...comments.map((c) => ({ ...c, type: 'comment' })),
    ...activities.map((a) => ({ ...a, type: 'activity' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  //  ADD COMMENT
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: async () => {
      await createActivity({
        taskId: task.id,
        userId: user.id,
        action: 'commented on task',
        createdAt: new Date().toISOString(),
      });

      queryClient.invalidateQueries(['comments', task.id]);
      queryClient.invalidateQueries(['activities', task.id]);
    },
  });

  //  HANDLER
  const handleSubmit = () => {
    if (!message.trim()) return;

    addCommentMutation.mutate({
      taskId: task.id,
      userId: user.id,
      message,
      createdAt: new Date().toISOString(),
    });

    setMessage('');
  };

  function formatTime(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

    return `${Math.floor(diff / 86400)}d`;
  }

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.panel} onClick={(e) => e.stopPropagation()}>
        <h3>Activity & Comments</h3>

        <div className={classes.timeline}>
          {combinedFeed.length === 0 && (
            <p className={classes.empty}>No activity yet</p>
          )}

          {combinedFeed.map((item) => {
            const u = safeUsers.find(
              (x) =>
                String(x.id) === String(item.userId) ||
                String(x.id) === String(item.userId).replace('u', ''),
            );

            return (
              <div key={item.id} className={classes.timelineItem}>
                <div className={classes.avatar}>
                  {u
                    ? `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`
                    : '?'}
                </div>

                <div className={classes.content}>
                  <div className={classes.header}>
                    <strong>
                      {u
                        ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                        : 'Unknown'}
                    </strong>

                    <span className={classes.time}>
                      {formatTime(item.createdAt)}
                    </span>
                  </div>

                  {item.type === 'comment' ? (
                    <p>{item.message}</p>
                  ) : (
                    <p className={classes.activity}>{item.action}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={classes.footer}>
          <div className={classes.inputRow}>
            <input
              className={classes.input}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Write a comment...'
            />
            <button onClick={handleSubmit} className={classes.sendBtn}>
              Send
            </button>
          </div>

          <button onClick={onClose} className={classes.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
