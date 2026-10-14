import { type ReactNode, useEffect, useState } from 'react'
import { get } from './utils/http.ts'
import BlogPosts, { type BlogPost } from './components/BlogPosts.tsx'
import fetchingImg from './assets/data-fetching.png'
import ErrorMessage from './components/ErrorMessage.tsx'

// Données brutes reçues de l'API
type RawDataBlogPost = {
  userId: number
  id: number
  title: string
  body: string
}

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  // Prévenir boucle infinie si on utilise setFetchedPosts après la requête GET sans useEffect
  // Le composant sera rendu en cas de MAJ du state sans renvoyer la requête GET
  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true)

      try {
        const data = (await get('https://jsonplaceholder.typicode.com/posts')) as RawDataBlogPost[]

        // Convertir data en tableau de type BlogPost
        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          }
        })

        // MAJ du state avec les posts reçus de l'API et convertis au bon format de données
        setFetchedPosts(blogPosts)
      } catch (error) {
        // permet de récupérer le message d'erreur qu'on a dans la fonction get()
        if (error instanceof Error) {
          setError(error.message)
        }
        // setError('Failed to fetch posts!')
      }

      setIsFetching(false)
    }

    fetchPosts()
  }, [])

  let content: ReactNode

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />
  }

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>
  }

  if (error) {
    content = <ErrorMessage text={error} />
  }

  return (
    <main>
      <img src={fetchingImg} alt="An abstract image depicting a data fetching process." />
      {content}
    </main>
  )
}

export default App
