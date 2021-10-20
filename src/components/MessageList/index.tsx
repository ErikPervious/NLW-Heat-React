import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../../services/api';

import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg'

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if(messagesQueue.length > 0) {
        setMessages(prevent => [
          messagesQueue[0],
          prevent[0],
          prevent[1],
        ].filter(Boolean));
        messagesQueue.shift();
      };
    }, 3000);
  }, []);
  
  useEffect(() => {
    api.get<Message[]>('/messages/last3').then(response => {
      return setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        { messages.map(value => {
          return (
            <li key={value.id} className={styles.message}>
              <p className={styles.messageContent}>{value.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={value.user.avatar_url} alt={value.user.name} />
                </div>
                <span>{value.user.name}</span>
              </div>
            </li>
          )
        })}

        
      </ul>
    </div>
  )
};