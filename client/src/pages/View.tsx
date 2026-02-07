import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { dummyProjects } from "../assets/assets"
import type { Project } from "../types"

const View = () => {
  const { projectId } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = dummyProjects.find(p => p.id === projectId)
    setTimeout(() => {
      if (found) setProject(found)
      setLoading(false)
    }, 600)
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!project?.current_code) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <p>This project is not published or not found.</p>
      </div>
    )
  }

  return (
    <iframe
      title={project.name}
      srcDoc={project.current_code}
      className="w-full h-screen border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}

export default View
