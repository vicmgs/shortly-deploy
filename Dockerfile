FROM node:4-onbuild

EXPOSE 4568

CMD ["node", "./server.js"]
