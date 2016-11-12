const isCoordination = (board) => {
  const coordinationTypes = [
    'coordinadores',
    'directores creativos',
    'directores de cuentas',
  ];

  return coordinationTypes.indexOf(board.type) > -1;
};

export default isCoordination;