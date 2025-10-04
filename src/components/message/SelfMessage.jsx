"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./SelfMessage.css";

let addMessageFn = null;

const SelfMessage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    addMessageFn = ({
      type,
      content,
      duration = 5000,
      position = "top-right",
    }) => {
      const id = Date.now() + Math.random();
      const msg = { id, type, content, position, closing: false };
      setMessages((prev) => [...prev, msg]);

      // Auto close
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, closing: true } : m))
        );

        setTimeout(() => {
          setMessages((prev) => prev.filter((m) => m.id !== id));
        }, 400); // match animation duration
      }, duration);
    };
  }, []);

  if (!messages.length) return null;

  const handleClose = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, closing: true } : m))
    );
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 400);
  };

  const positions = ["top-right", "top-left", "bottom-right", "bottom-left"];
  const groupedMessages = positions.reduce((acc, pos) => {
    acc[pos] = messages.filter((msg) => msg.position === pos);
    return acc;
  }, {});

  return (
    <>
      {positions.map((pos) => (
        <div key={pos} className={`self-message-container ${pos}`}>
          {groupedMessages[pos]?.map((msg, index) => (
            <div
              key={msg.id}
              className={`self-message self-message-${msg.type} ${
                msg.closing ? `slide-out-${pos}` : `slide-in-${pos}`
              }`}
              style={{ transform: `translateY(${index * 10}px)` }}
            >
              <span className="icon">
                {msg.type === "success" && <CheckCircleOutlined />}
                {msg.type === "error" && <CloseCircleOutlined />}
                {msg.type === "info" && <InfoCircleOutlined />}
                {msg.type === "warning" && <ExclamationCircleOutlined />}
              </span>
              <span className="text">{msg.content}</span>
              <span className="close-btn" onClick={() => handleClose(msg.id)}>
                <CloseOutlined />
              </span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export const selfMessage = {
  success: (content, duration, position) =>
    addMessageFn?.({ type: "success", content, duration, position }),
  error: (content, duration, position) =>
    addMessageFn?.({ type: "error", content, duration, position }),
  info: (content, duration, position) =>
    addMessageFn?.({ type: "info", content, duration, position }),
  warning: (content, duration, position) =>
    addMessageFn?.({ type: "warning", content, duration, position }),
};

export default SelfMessage;
