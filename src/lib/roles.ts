// `owner` é a conta criada no onboarding; `admin` fica reservado para
// moderadores futuros. Os dois podem publicar, aceitar propostas e exportar.
export const canModerate = (role: string | null | undefined) =>
  role === 'owner' || role === 'admin'
