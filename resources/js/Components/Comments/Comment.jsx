import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const Comment = ({ comment, onReplySubmitted }) => {
  const { auth, users } = usePage().props;
  const [activeReply, setActiveReply] = useState(null);
  const [mentionName, setMentionName] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef(null);

  const toggleReply = (replyId, userName) => {
    if (activeReply === replyId) {
      setActiveReply(null);
      setReplyText('');
      setMentionName('');
    } else {
      setActiveReply(replyId);
      setMentionName(userName);
      const mention = `@${userName} `;
      setReplyText((prev) => prev.startsWith(mention) ? prev : mention);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [replyText]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setReplyText(value);
    const lastWord = value.split(' ').pop();

    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1);
      if (query.length >= 2) {
        const filteredSuggestions = users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleMentionSelect = (userName) => {
    const mention = `@${userName} `;
    setReplyText((prev) => {
      const lastSpaceIndex = prev.lastIndexOf(' ');
      return prev.slice(0, lastSpaceIndex + 1) + mention;
    });
    setSuggestions([]);
  };

  const handleReplySubmit = () => {
    if (!replyText.trim() || activeReply === null) return;

    router.post(route('comments.store'), {
      contenido: replyText,
      commentable_type: 'App\\Models\\Comment',
      commentable_id: comment.id,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        const newReply = {
          id: Date.now(),
          contenido: replyText,
          user: auth.user,
          created_at: new Date().toISOString(),
          commentable_type: 'App\\Models\\Comment',
          commentable_id: comment.id,
        };

        setReplies((prev) => [...prev, newReply]);
        setReplyText('');
        setActiveReply(null);
        setMentionName('');
        setShowReplies(true);
        if (onReplySubmitted) onReplySubmitted();
      },
    });
  };

  const loadReplies = async () => {
    if (!showReplies && replies.length === 0) {
      try {
        const response = await fetch(`/comments/${comment.id}/replies`);
        const data = await response.json();
        setReplies(data);
      } catch (error) {
        console.error('Error al cargar respuestas:', error);
      }
    }
    setShowReplies(!showReplies);
  };

  const renderCommentWithMentions = (content) => {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const beforeMention = content.slice(lastIndex, match.index);
      const username = match[1];
      const user = users.find((user) => user.name === username);

      if (beforeMention) parts.push(beforeMention);

      if (user) {
        parts.push(
          <a key={match.index} href={route('users.show', user.id)} className="text-blue-500 hover:underline">
            @{username}
          </a>
        );
      } else {
        parts.push(`@${username}`);
      }

      lastIndex = mentionRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="mb-3 border-b pb-2">
      <p className="text-sm text-gray-700">
        <strong>{comment.user.name}</strong>
      </p>
      <p className="text-sm text-gray-700">
        {renderCommentWithMentions(comment.contenido)}
      </p>
      <p className="text-xs text-gray-400">
        {new Date(comment.created_at).toLocaleString()}
      </p>

      {/* Ocultar botón si el comentario es del mismo usuario */}
      {auth.user.id !== comment.user.id && (
        <button
          onClick={() => toggleReply(comment.id, comment.user.name)}
          className="text-blue-500 text-sm hover:underline mt-1"
        >
          {activeReply === comment.id ? 'Cancelar' : 'Responder'}
        </button>
      )}

      {comment.commentable_type === 'App\\Models\\Post' && replies.length > 0 && (
        <button
          onClick={loadReplies}
          className="text-indigo-500 text-sm hover:underline mt-1 ml-4"
        >
          {showReplies
            ? 'Ocultar respuestas'
            : `Ver ${replies.length} respuesta${replies.length > 1 ? 's' : ''}`}
        </button>
      )}

      {showReplies && (
        <div className="ml-4 mt-2 border-l pl-3">
          {replies.map((reply) => (
            <div key={reply.id} className="mb-2">
              <p className="text-sm text-gray-700">
                <strong>{reply.user.name}</strong>
              </p>
              <p className="text-sm text-gray-700">
                {renderCommentWithMentions(reply.contenido)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(reply.created_at).toLocaleString()}
              </p>

              {/* Ocultar botón si la respuesta es del mismo usuario */}
              {auth.user.id !== reply.user.id && (
                <button
                  onClick={() => toggleReply(reply.id, reply.user.name)}
                  className="text-blue-500 text-sm hover:underline mt-1"
                >
                  {activeReply === reply.id ? 'Cancelar' : 'Responder'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeReply !== null && (
        <div className="mt-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={replyText}
            onChange={handleInputChange}
            placeholder="Escribe una respuesta..."
            className="w-full p-2 border border-gray-300 rounded resize-none overflow-hidden text-sm"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list bg-white border border-gray-300 mt-1">
              {suggestions.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleMentionSelect(user.name)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={handleReplySubmit}
            className="mt-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            Enviar respuesta
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
