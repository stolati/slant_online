export const basic_rules = [
  //Rule with one element and border
  `
  *   |   *
  -   0   -
  \\! | //!
  `,
  `INVERTED_VALID
  *   |  *
  -   1  - 
  //? |  //!
  `,
  `
  *   |   *
  -   1   -
  *   |  \\!
  `,
  `
  *   |  *
  -   2  - 
  //! |  \\!
  `,
  //Rule with only one element (easy mode)
  `INVERTED_VALID
  \\? | \\!
  -   1  - 
  \\! | //!
  `,
  `INVERTED_VALID
  \\? | //? 
  -   2   -
  \\! | //!
  `,
  `INVERTED_VALID
  \\? | \\! 
  -   2   -
  \\! | \\?
  `,
  `
  \\! |  .  | \\? 
  -   2  -  .  -
  \\? |  .  | //?
  `,
  `
  \\! |  .  | \\? 
  -   3  -  .  -
  //! |  .  | //?
  `,
  `INVERTED_VALID
  //? | //! 
  -   3   -
  //! | \\!
  `,
  `
  \\! | //! 
  -   4   -
  //! | \\!
  `,
  //Rule with 2 elements and border
  `INVERTED_VALID
  *  |  .  | \\?
  -  1  -  2 -
  *  |  .  | \\!
  `,
  `
  *  |  .  | //!
  -  1  -  3 -
  *  |  .  | \\!
  `,
  `INVERTED_VALID
  *  |  .  |  .  | \\?
  -  1  -  2  -  2 -
  *  |  .  |  .  | \\!
  `,
  //Rule with 2 elements (hard mode, easy patterns)
  `INVERTED_VALID
  //? |  .  | //!
  -   2  -  3 -
  //! |  .  | \\!
  `,
  `
  //! |  .  | \\!
  -   1  -  1 -
  \\! |  .  | //!
  `,
  `
  \\! |  .  | //!
  -   3  -  3 -
  //! |  .  | \\!
  `,
  `INVERTED_VALID
  \\? |  .  | //?
  -   2  -  2 -
  \\! |  .  | //!
  `,
  `INVERTED_VALID
  \\? |  .  | \\!
  -   2  -  2 -
  \\! |  .  | \\?
  `,
  `INVERTED_VALID
  //! |  .  | \\!
  -   2  -  1 -
  //? |  .  | //!
  `,
  `INVERTED_VALID
  //! |  .  | //?
  -   1  -  3 -
  \\! |  .  | \\?
  `,
  `
  .  |  .  |  . 
  -  1  -  . -
  .  | //! |  .
  -  .  -  1 -
  .  |  .  |  .
  `,
  // Same rules, but with a bunch of 2
  `
  //! |  .  |  .  | \\!
  -   1  -  2  -  1 -
  \\! |  .  |  .  | //!
  `,
  `
  //! |  .  |  .  |  .  | \\!
  -   1  -  2  -  2  -  1 -
  \\! |  .  |  .  |  .  | //!
  `,
  `INVERTED_VALID
  //! |  .  |  .  | //?
  -   1  -  2  -  2 -
  \\! |  .  |  .  | //!
  `,
  `
  //? |  .  |  .  | //!
  -   2  -  2  -  3 -
  //! |  .  |  .  | \\!
  `,
  `INVERTED_VALID
  \\? |  .  |  .  | \\!
  -   3  -  2  -  1 -
  //? |  .  |  .  | //!
  `,
  `
  \\! |  .  |  .  | //!
  -   3  -  2  -  3 -
  //! |  .  |  .  | \\!
  `,
  `
  \\! |  .  |  .  | \\? 
  -   2  -  2  - .  -
  \\? |  .  |  .  | //?
  `,
  // avoid small loops
  `
  //? | //!
  -   .  -
  \\? | //?
  `,
  `
  //? | \\? |  . 
  -   .  -  . -
  \\? |  .  | \\? 
  -   .  -  . -
  .   | \\? | \\! 
  `,
  `
  //? | \\? |  . 
  -   .  -  . -
  \\? |  .  | //! 
  -   .  -  . -
  .   | \\? | //? 
  `,
  `
   .  | //? | \\? |  .
   -  .  -  .  -  .  -
  //? |  .  |  .  | \\?
   -  .  -  .  -  .  -
  \\? |  .  |  .  | //?
   -  .  -  .  -  .  -
   .  | //! | //? |  .
  `,
]

/*
Empty pattern to copy paste
   .  |  .  |  .  |  .
   -  .  -  .  -  .  -
   .  |  .  |  .  |  .
   -  .  -  .  -  .  -
   .  |  .  |  .  |  .
   -  .  -  .  -  .  -
   .  |  .  |  .  |  .




 */
