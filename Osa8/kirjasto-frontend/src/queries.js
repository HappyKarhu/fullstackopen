import {gql} from '@apollo/client'

//name=authour object
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
    name
    born
    bookCount
    id
  }
}
`

//author=book object -for 8.17 here is mistake
export const ALL_BOOKS = gql`
  query {
    allBooks {
    title
    author {
      name
      id
    }
    genres
    published
    id
  }
}
`
export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
      ) {
    title
      author
    published
    genres
    id
  }
}  
`
export const SET_AUTHOR = gql`
  mutation editAuthor(
    $name: String!
    $born: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $born
      ) {
    name
    born
    id
  }
}  
`