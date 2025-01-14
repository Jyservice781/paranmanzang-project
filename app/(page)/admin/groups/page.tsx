"use client"
import Pagination from "@/components/common/Row/pagination/Pagination";
import { GroupResponseModel } from "@/models/group/group.model";
import { chatRoomService } from "@/services/chat/chatRoom-service";
import { groupService } from "@/services/group/group-service";
import { getEnableGroups, getGroups, getTotalPageAbleGroup, getTotalPageEnableGroup, saveCurrentGroup } from "@/lib/features/group/group.slice";
import { useAppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function GroupsAdmin() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const totalPageEnabledGroup = useSelector(getTotalPageEnableGroup)
  const totalPageAbleGroup = useSelector(getTotalPageAbleGroup)

  useEffect(() => {
    groupService.findList(page, pageSize, dispatch)
    groupService.enableList(page, pageSize, dispatch)
  }, [page, pageSize])

  const onClickToDetail = (group: GroupResponseModel) => {
    dispatch(saveCurrentGroup(group));
    router.push(`/groups/${group.id}`);
  };
  const [activeTab, setActiveTab] = useState<string>("승인 완료");
  const dispatch = useAppDispatch()
  // 승인된 소모임 내역
  const groups = useSelector(getGroups)
  // 승인되지 않은 소모임 내역
  const enableGroups = useSelector(getEnableGroups)

  const ableGroup = (group: GroupResponseModel) => {
    groupService.able(group, dispatch)
    chatRoomService.insert({ roomName: group.name, nickname: group.nickname, dispatch: dispatch })
      .then(result => {
        const groupModel: GroupResponseModel = {
          id: group.id,
          name: group.name,
          categoryName: group.categoryName,
          createAt: group.createAt,
          enabled: true,
          detail: group.detail,
          nickname: group.nickname,
          chatRoomId: result,
        };
        groupService.modifyChatRoomId(groupModel, Number(group.id), dispatch)
      })
  }

  const enableGroup = (group: GroupResponseModel) => {
    groupService.enable(group.id, dispatch);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "승인 완료":
        return (
          <ul>
            {groups.length > 0 ? (
              groups.map((group, index) => (
                <li key={index} className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 px-8 shadow-sm">
                  <p className="font-bold text-gray-800" onClick={() => onClickToDetail(group)}>
                    {group.name}
                  </p>
                  <button
                    className="rounded-lg bg-red-400 px-4 py-2 text-white hover:bg-red-500"
                    onClick={() =>
                      enableGroup(group)
                    }
                  >
                    승인 취소
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">승인한 소모임 목록이 없습니다.</p>
            )}
          </ul>
        );
      case "승인 대기":
        return (
          <ul>
            {enableGroups.length > 0 ? (
              enableGroups.map((group, index) => (
                <li key={index} className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 px-8 shadow-sm">
                  <p className="font-bold text-gray-800" onClick={() => onClickToDetail(group)}>
                    {group.name}
                  </p>
                  <button
                    className="rounded-lg bg-red-400 px-4 py-2 text-white hover:bg-red-500"
                    onClick={() =>
                      ableGroup(group)
                    }
                  >
                    승인
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">승인 요청이 없습니다.</p>
            )}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto my-10 max-w-4xl rounded-lg bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-lg py-4">
          <h1 className="text-lg font-semibold">소모임 승인 요청</h1>
        </div>
        <button
          type="button"
          onClick={() => { router.back() }}
          className="my-4 rounded-lg border border-green-400 bg-green-400 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-green-500"
        >
          뒤로가기
        </button>
      </div>


      <div className="my-6">
        {/* 탭 버튼 */}
        <div className="shadow-b-lg flex justify-center rounded-t-lg bg-green-50 py-8">
          <button
            className={`mx-2 rounded-lg px-4 py-2 ${activeTab === "승인 완료" ? "bg-green-400 text-white" : "bg-gray-200"
              }`}
            onClick={() => setActiveTab("승인 완료")}
          >
            승인 완료
          </button>
          <button
            className={`mx-2 rounded-lg px-4 py-2 ${activeTab === "승인 대기" ? "bg-green-400 text-white" : "bg-gray-200"
              }`}
            onClick={() => setActiveTab("승인 대기")}
          >
            승인 대기
          </button>
        </div>

        {/* 탭 내용 렌더링 */}
        <div className="rounded-b-lg bg-green-50 p-8">{renderTabContent()}</div>
      </div>
      <Pagination
        currentPage={page}
        totalPages={activeTab === "승인 완료" ? totalPageAbleGroup : totalPageEnabledGroup}
        onPageChange={setPage}
      />
    </div>
  );
}