interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function signIn(): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "aosidjaoisdjasdqw23412311241",
        user: {
          name: "Danilo",
          email: "danilo@rocketseat.com.br",
        },
      });
    }, 2000);
  });
}
