exports.handler = async (event: any, context: any) => {
  console.log('Username:', event.username, 'ServerId: ', event.serverId);

  if (event.username == 'test' && event.password == 'test') {
    return {
      Role: process.env.ROLE_ARN,
      PosixProfile: {
        Uid: 0,
        Gid: 0,
      },
      Policy: '',
      HomeDirectory: `/${process.env.EFS_ID}`,
    };
  }

  return {};
};
