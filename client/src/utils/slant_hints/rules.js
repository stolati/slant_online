export const basic_rules = [
  //Rule with only one element (easy mode)
  `
  \\? | \\!
  -   1  - 
  \\! | //!
  `,
  // `
  // *   |   *
  // -   0   -
  // \\! | //!
  // `,
  //Rule with 2 elements (hard mode, easy patterns)
  `
  //? |  . | //!
  -   2  - 3 -
  //! |  . | \\!
  `,
  `
  //! |  . | \\!
  -   1  - 1 -
  \\! |  . | //!
  `,
  `
  \\! |  . | //!
  -   3  - 3 -
  //! |  . | \\!
  `,
]
