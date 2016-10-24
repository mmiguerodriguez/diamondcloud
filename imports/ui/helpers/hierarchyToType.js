/**
 * Receives a hierarchy of a user from a team and returns
 * the hierarchy expressed to a board type
 *
 * @param  {String} hierarchy User hierarchy on the team
 * @return {String} type The board type we need for the user
 */
const hierarchyToType = (hierarchy) => {
  /**
   * Array of <userHierarchy, boardTyper> pairs
   * [
   *   [userHierarchy, boardType]
   * ]
   */
  const HIERARCHIES = [
    ['creativo', 'creativos'],
    ['sistemas', 'sistemas'],
    ['director creativo', 'directores creativos'],
    ['director de cuentas', 'directores de cuentas'],
    ['coordinador', 'coordinadores'],
    ['administrador', 'administradores'],
    ['medios', 'medios'],
  ];

  for (let i = 0; i < HIERARCHIES.length; i += 1) {
    if (HIERARCHIES[i][0] === hierarchy) {
      return HIERARCHIES[i][1];
    }
  }

  return 'default';
};

export default hierarchyToType;
