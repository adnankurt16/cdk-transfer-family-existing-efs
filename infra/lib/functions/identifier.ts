exports.handler = async (event: any, context: any) => {
  console.log('Username:', event.username, 'ServerId: ', event.serverId);

  // always allow
  return {
    Role: process.env.ROLE_ARN,
    PosixProfile: {
      Uid: parseInt(process.env.UID || '0'),
      Gid: parseInt(process.env.GID || '0'),
    },
    Policy: '',
    HomeDirectory: `/${process.env.EFS_ID}`,
  };
};
