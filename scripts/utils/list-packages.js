import { exec } from 'child_process';

export const listOfPackages = () =>
  new Promise((res, rej) => {
    const command = `npx lerna list --json`;
    exec(command, (e, result) => {
      if (e) {
        rej(e);
      } else {
        const data = JSON.parse(result.toString().trim());
        res(data);
      }
    });
  });
