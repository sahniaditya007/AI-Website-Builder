import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2Icon, ArrowLeft } from "lucide-react"
import { dummyProjects } from "../assets/assets"
import type { Project } from "../types"

const Preview = () => {
  const { projectId, versionId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = dummyProjects.find(p => p.id === projectId)
    setTimeout(() => {
      if (found) setProject(found)
      setLoading(false)
    }, 800)
  }, [projectId, versionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-xl">Project not found</p>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          My Projects
        </button>
      </div>
    )
  }

  const code = versionId
    ? project.versions?.find(v => v.id === versionId)?.code ?? project.current_code
    : project.current_code

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/95 sticky top-0 z-10">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          Back to projects
        </button>
        <span className="text-sm text-gray-400 truncate max-w-[200px]">{project.name}</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        {code ? (
          <iframe
            title="Preview"
            srcDoc={code}
            className="w-full max-w-5xl h-[80vh] rounded-lg border border-gray-700 bg-white"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="text-center text-gray-500">
            <p>No preview available for this project.</p>
            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="mt-3 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Open in builder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Preview
