'use client'
import MarkdownEditor from '@/app/components/MarkdownEditor/MarkdownEditor'
import { useState, useEffect, FormEvent } from 'react'
import { NextResponse } from 'next/server'
import Spinner from '@/app/components/Loading/Spinner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Project {
  id: number
  name: string
  short_description: string
  long_description: string
  repository: string
  technologies: string
  created_at: string
  updated_at: string
  star_count: number
  contributor_count: number
  codebase_visibility: string
  fk_imagesid_images: number

  logo: string
  images: {
    image: {
      data: Buffer
      contentType: string
    }
  }
}
interface Fault {
  id: number
  title: string
  created_at: string
  description: string
  severity: string
  status: string
  fk_projectid: number
  fk_userid: number
}

export default function FaultConvertPage({
  params,
}: {
  params: { id: number; faultId: number }
}) {
  const [project, setProject] = useState<Project>()
  const [loading, setLoading] = useState(true)
  const [fault, setFault] = useState<Fault | undefined>()
  const projectId = params.id
  const faultId = params.faultId
  const [issueTitle, setIssueTitle] = useState<string>('')
  const [formErrors, setFormErrors] = useState<any>({})
  const [issueDescription, setIssueDescription] = useState<string>('')
  const [issueVisibility, setIssueVisibility] = useState<string>('public')
  const [issueSeverity, setIssueSeverity] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    if (projectId) {
      fetch(`/api/project/${projectId}`)
        .then((res) => res.json())
        .then((data) => {
          setTimeout(() => {
            setProject(data)
            setLoading(false)
          }, 500)
        })
        .catch(console.error)
    }
  }, [projectId])

  useEffect(() => {
    if (faultId) {
      fetch(`/api/project/${projectId}/faults/${faultId}`)
        .then((res) => {
          if (res.status === 404) {
            setFault(undefined)
            throw new Error('Fault not found')
          }
          return res.json()
        })
        .then((data) => {
          if (data) {
            setFault(data)
            setIssueTitle(data.title)
            setIssueDescription(data.description)
            setIssueSeverity(data.severity)
          }
        })
        .catch(console.error)
    }
  }, [faultId, projectId])

  const formValidated = () => {
    const errors: { issueTitle?: string; issueDescription?: string } = {}

    if (!issueTitle.trim())
      errors.issueTitle = 'Pavadinimas negali būti tuščias.'
    if (!issueDescription.trim())
      errors.issueDescription = 'Aprašymas negali būti tuščias.'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    console.log('Saving fault')
    const faultData = {
      title: issueTitle,
      created_at: fault?.created_at,
      description: issueDescription,
      severity: issueSeverity,
      status: 'open',
    }

    try {
      const response = await fetch(
        `/api/project/${projectId}/faults/${faultId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faultData),
        },
      )

      if (response.ok) {
        toast.success('Klaida atnaujinta sėkmingai')
        window.location.href = `/project/${projectId}/fault`
        return new NextResponse(JSON.stringify({ message: 'Fault updated' }), {
          status: 200,
        })
      } else {
        toast.error('Klaidos atnaujinti nepavyko')
        return new NextResponse(
          JSON.stringify({ message: 'Error updating fault' }),
          { status: 500 },
        )
      }
    } catch (error: any) {
      toast.error('Klaida atnaujinant klaidą')
      return new NextResponse(
        JSON.stringify({ message: 'Network error', error: error.message }),
        { status: 500 },
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Handling submit')
    e.preventDefault()
    if (!formValidated()) return

    if (e.currentTarget.name === 'save') {
      handleSave()
      return
    }
    console.log('Converting fault to issue')
    const issueData = {
      title: issueTitle,
      description: issueDescription,
      visibility: issueVisibility,
      status: 'open',
      id_project: projectId,
    }
    try {
      const response = await fetch(`/api/project/${projectId}/issues/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      })

      if (response.ok) {
        const res2 = await fetch(`/api/fault/${projectId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ faultId }),
        })
        if (res2.ok) {
          toast.success('Klaida konvertuota į trūkumą')
          window.location.href = `/project/${projectId}/fault`
          return new NextResponse(
            JSON.stringify({ message: 'Fault converted to issue' }),
            { status: 200 },
          )
        }
      } else {
        toast.error('Nepavyko konvertuoti klaidą į trūkumą')
        return new NextResponse(
          JSON.stringify({ message: 'Error converting fault to issue' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        )
      }
    } catch (error: any) {
      toast.error('Įvyko klaida konvertuojant klaidą į trūkumą')
      return new NextResponse(
        JSON.stringify({ message: 'Network error', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {loading ? (
        <div className="mt-5">
          <Spinner />
        </div>
      ) : (
        <>
          {project && fault !== undefined ? (
            <form
              className="w-full flex flex-col justify-center items-center mt-5"
              onSubmit={handleSubmit}
            >
              <div className="border-2 rounded-xl border-gray-200 overflow-hidden w-[800px] break-words">
                <div className="py-2 border-b-2 border-gray-200">
                  <h2 className=" text-2xl font-bold text-gray-800 text-center">
                    Klaidos redagavimas
                  </h2>
                </div>
                <div className="flex mb-4 px-6 bg-white">
                  <div className="flex flex-col items-start justify-center w-full h-full">
                    <label
                      htmlFor="title"
                      className="block text-gray-800 font-bold mt-3"
                    >
                      Pavadinimas
                    </label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Pavadinimas"
                      className="w-full border border-gray-300 py-2 pl-3 rounded outline-none focus-within:border-black"
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                    />
                    {formErrors.issueTitle && (
                      <div className="text-red-500">
                        {formErrors.issueTitle}
                      </div>
                    )}

                    <label
                      htmlFor="description"
                      className="block text-gray-800 font-bold mt-3"
                    >
                      Aprašymas
                    </label>
                    <MarkdownEditor
                      markdownText={issueDescription}
                      setMarkdownText={(value) => setIssueDescription(value)}
                    />
                    {formErrors.issueDescription && (
                      <div className="text-red-500">
                        {formErrors.issueDescription}
                      </div>
                    )}

                    <label
                      htmlFor="severity"
                      className="block text-gray-800 font-bold mt-3"
                    >
                      Klaidos svarbumas
                    </label>
                    <select
                      id="severity"
                      className="w-full border border-gray-300 py-2 pl-3 rounded outline-none focus-within:border-black"
                      value={issueSeverity}
                      onChange={(e) => setIssueSeverity(e.target.value)}
                    >
                      <option value="low">Mažas</option>
                      <option value="medium">Vidutinis</option>
                      <option value="high">Didelis</option>
                    </select>
                    <label
                      htmlFor="visibility"
                      className="block text-gray-800 font-bold mt-3"
                    >
                      Trūkumo matomumas
                    </label>
                    <select
                      id="visibility"
                      className="w-full border border-gray-300 py-2 pl-3 rounded outline-none focus-within:border-black"
                      value={issueVisibility}
                      onChange={(e) => setIssueVisibility(e.target.value)}
                    >
                      <option value="public">Viešas</option>
                      <option value="private">Privatus</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-center mb-4 mt-2">
                  <Link
                    href={`/project/${projectId}/fault`}
                    passHref
                    className="py-2 mr-2 px-4 rounded-lg text-black bg-gray-300 hover:bg-red-400 transition duration-150 ease-in-out"
                  >
                    Atšaukti
                  </Link>
                  <button
                    type="submit"
                    name="convert"
                    className="py-2 px-4 mr-2 rounded-lg text-black bg-yellow-400 hover:bg-yellow-600 transition duration-150 ease-in-out"
                  >
                    Konvertuoti į trūkumą
                  </button>
                  <button
                    type="submit"
                    name="save"
                    className="py-2 px-4 rounded-lg text-black bg-green-500 hover:bg-green-700 transition duration-150 ease-in-out"
                  >
                    Išsaugoti
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border-2 border-gray-100 mt-6 w-[800px] p-5 text-center">
              <h1 className="text-xl font-bold">
                Nepavyko užkrauti duomenų.
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  )
}
