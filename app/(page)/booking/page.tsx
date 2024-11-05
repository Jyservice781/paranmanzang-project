"use client"
import { getNickname } from '@/app/api/authUtils'
import { GroupResponseModel } from '@/app/model/group/group.model'
import { groupService } from '@/app/service/group/group.service'
import { getLeaderGroups, saveCurrentGroup } from '@/lib/features/group/group.slice'
import { useAppDispatch } from '@/lib/store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'


export default function LeaderGroup() {
  const dispatch = useAppDispatch()
  const groups = useSelector(getLeaderGroups)
  const nickname = useSelector(getNickname)
  const router = useRouter();

  useEffect(() => {
    if (nickname) {
      groupService.findByNickname(nickname, dispatch)
    }
  }, [nickname, dispatch])

  const handleDetailClick = (group: GroupResponseModel) => {
    dispatch(saveCurrentGroup(group))
    router.push(`/booking/${group.id}`);
  };

  return (
    <ul className="space-y-4">
      {groups.map((group) => (
        <li key={group.id} className="p-5 bg-white shadow rounded-lg">
          <div>
            <h5 className={`mb-2 text-lg font-medium tracking-tight text-green-600'}`}>
              {group.name || 'Group Title'}
            </h5>
            <p className="mb-3 text-sm font-medium text-gray-700">
              {group.detail || 'Group Content'}
            </p>
            <div className="w-full mb-2">
              <span className="text-xs bg-green-400 p-1 text-white rounded-full">
                {group.categoryName || 'Category'}
              </span>
            </div>
            <button
              onClick={() => handleDetailClick(group)}
              className={`mt-3 w-full inline-flex items-center justify-center rounded-lg p-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700' 
                }`}
            >
              스케쥴 관리 하기
              <svg
                className="ml-2 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
