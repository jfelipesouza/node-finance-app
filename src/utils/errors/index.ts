type ErroInfo = { code: number; description: string; name: string };

export type ErrorsFilter = "all" | "auth";

const errors = [
  {
    code: 0,
    description: "Não possui erros mapeados",
    name: "Not Error",
  },
  {
    code: 100,
    description:
      "As credenciais fornecidas são inválidas. Verifique usuário e senha.",
    name: "Invalid credentials",
  },
  {
    code: 101,
    description: "Já existe um usuário cadastrado com essas informações.",
    name: "User already exist",
  },
  {
    code: 102,
    description: "O usuário informado não foi encontrado no sistema.",
    name: "User not exist",
  },
  {
    code: 103,
    description: "Falha ao realizar login. Tente novamente.",
    name: "Failed in login",
  },
  {
    code: 104,
    description: "Token de acesso não encontrado. Autenticação necessária.",
    name: "Access token not found",
  },
  {
    code: 105,
    description:
      "O token expirou e não foi encontrado um refresh token válido.",
    name: "Token expired. refresh token not exist",
  },
  {
    code: 106,
    description: "O refresh token fornecido é inválido ou foi revogado.",
    name: "Refresh token invalid",
  },
  {
    code: 107,
    description: "O token fornecido é inválido ou corrompido.",
    name: "Token invalid",
  },
];

export const allErrors = ({
  filter = "all",
}: {
  filter: ErrorsFilter;
}): ErroInfo[] => {
  if (filter === "auth") {
    return errors.filter((item) => {
      if (item.code >= 100 && item.code < 200) return item;
    });
  }
  return errors;
};
