import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let ioInstance: SocketIOServer | null = null;

export const initSocketManager = (httpServer: HTTPServer): SocketIOServer => {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Join room based on user role and ID
    socket.on('join:room', (data: { userId: string; role?: string }) => {
      if (data?.userId) {
        socket.join(`user:${data.userId}`);
        if (data.role === 'GUARDIAN') {
          socket.join(`guardian:${data.userId}`);
        }
        if (data.role === 'ADMIN') {
          socket.join('admin:room');
        }
        console.log(`[Socket.IO] Socket ${socket.id} joined rooms for user ${data.userId} (${data.role || 'USER'})`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getSocketManager = (): SocketIOServer | null => ioInstance;
