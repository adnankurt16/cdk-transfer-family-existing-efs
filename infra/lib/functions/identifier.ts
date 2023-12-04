exports.handler = async (event: any, context: any) => {
  console.log('Username:', event.username, 'ServerId: ', event.serverId);

  // Conditionally allow or deny access to the server
  if (event.username === process.env.FTP_USERNAME && event.password === process.env.FTP_PASSWORD) {
    return {
      Role: process.env.ROLE_ARN,
      PosixProfile: {
        Uid: parseInt(process.env.UID || '0'),
        Gid: parseInt(process.env.GID || '0'),
      },
      Policy: '',
      HomeDirectory: `/${process.env.EFS_ID}`,
    };
  }

  return {};
};
