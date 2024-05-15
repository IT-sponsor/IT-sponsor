'use client'
import defaultUserPhoto from '@/public/assets/defaultUser.jpg'
import FaultCardSmall from '@/app/components/Fault/Cards/FaultCardSmall'
import { useState, useEffect } from 'react'
import Spinner from '@/app/components/Loading/Spinner'
import { useSession } from 'next-auth/react'
import UserSearch from '@/app/components/User/UserSearch'
import IssueFilter from '@/app/components/Issue/IssueFilter'

interface Fault {
  id: number
  title: string
  created_at: string
  description: string
  replication_steps: string
  fix_info: string
  severity: string
  status: string
  id_project: number // Project that the fault is associated with
  users: {
    id: number
    first_name: string
    last_name: string
    logo: string
    images: {
      image: {
        data: Buffer
      }
    }
  }
}

export default function FaultPage({ params }: { params: { id: number } }) {
  const [faults, setFaults] = useState<Fault[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [canAccessAll, setCanAccessAll] = useState(false)
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFaults, setFilteredFaults] = useState<Fault[] | null>(null)
  const [filter, setFilter] = useState('all')
  const [userFaults, setUserFaults] = useState<Fault[] | null>(null)

  const projectId = params.id

  useEffect(() => {
    if (projectId) {
      fetch(`/api/project/${projectId}/faults`)
        .then((res) => res.json())
        .then((data) => {
          setTimeout(() => {
            setFaults(data)
            setLoading(false)
          }, 300)
        })
        .catch(console.error)
    }
  }, [projectId])

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await fetch(`/api/controls/${projectId}`)
        const data = await response.json()
        if (data.length > 0) {
          const ownerId = data[0].fk_usersid.toString()
          const hasAccess = ownerId === session?.user?.id
          setCanAccessAll(hasAccess)
        }
      } catch (error) {
        console.error('Error fetching controls:', error)
      }
    }
    fetchAccess()
  }, [projectId, session])

  useEffect(() => {
    let filteredResult = faults
    if (searchQuery) {
      filteredResult =
        filteredResult?.filter(
          (fault) =>
            fault.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fault.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || []
    }
    if (filter !== 'all') {
      filteredResult =
        filteredResult?.filter((fault) => fault.severity === filter) || []
    }
    setFilteredFaults(filteredResult)
  }, [searchQuery, faults, filter])

  useEffect(() => {
    setUserFaults(
      filteredFaults?.filter(
        (fault) => fault?.users?.id === Number(session?.user?.id),
      ) ?? null,
    )
  }, [filteredFaults, session])

  return (
    <>
      <div className="flex flex-row items-end pt-6 w-full max-w-5xl overflow-y-auto">
        <UserSearch setSearchTerm={setSearchQuery} />
        <IssueFilter setFilter={setFilter} />
      </div>

      <div className="flex flex-col items-center justify-center pt-6 w-full max-w-5xl">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {filteredFaults?.length ? (
              canAccessAll ? (
                filteredFaults.map((fault, index) => (
                  <div
                    className="flex flex-col items-center justify-center w-full overflow-y-auto"
                    key={index}
                  >
                    <FaultCardSmall
                      id={fault.id}
                      title={fault.title}
                      description={fault.description}
                      severity={fault.severity}
                      status={fault.status}
                      created_at={new Date(
                        fault.created_at,
                      ).toLocaleDateString()}
                      first_name={fault.users.first_name}
                      last_name={fault.users.last_name}
                    />
                  </div>
                ))
              ) : userFaults?.length ? (
                userFaults.map((fault, index) => (
                  <div
                    className="flex flex-col items-center justify-center w-full overflow-y-auto"
                    key={index}
                  >
                    <FaultCardSmall
                      id={fault.id}
                      title={fault.title}
                      description={fault.description}
                      severity={fault.severity}
                      status={fault.status}
                      created_at={new Date(
                        fault.created_at,
                      ).toLocaleDateString()}
                      first_name={fault.users.first_name}
                      last_name={fault.users.last_name}
                    />
                  </div>
                ))
              ) : (
                <div>Jūs neturite klaidų pranešimų</div>
              )
            ) : searchQuery ? (
              <div>Nėra klaidų pranešimų atitinkančių paieškos užklausą</div>
            ) : (
              <div>Projektas neturi klaidų pranešimų</div>
            )}
          </>
        )}
      </div>
    </>
  )
}
