"use client"
import { useRouter } from "next/navigation";
import CategorySelect from "../common/CategorySelect";
import Alert from "../common/Alert";
import { useState } from "react";
import { useAppDispatch } from "@/lib/store";
import { groupService } from "@/services/group/group-service";
import { getNickname } from "@/lib/features/users/user.slice";
import { useSelector } from "react-redux";
import { GroupModel } from "@/models/group/group.model";

export default function GroupAdd() {
    const route = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch()
    const [groupName, setGroupName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [groupDetails, setGroupDetails] = useState("");
    const nickname = useSelector(getNickname)

    const handleCategoryChange = (selectedCategory: string) => {
        setCategoryName(selectedCategory);
    };


    const createGroup = () => {
        {
            !nickname && (
                <Alert message="로그인 후 재접속 바랍니다" isOpen={isOpen} onClose={() => { }} />
            )
        }
        if (nickname) {
            const groupModel: GroupModel = {
                name: groupName,
                categoryName: categoryName,
                detail: groupDetails,
                nickname: nickname,
            };
            groupService.insert(groupModel, dispatch)
            route.push('/')
        }
    }

    return (
        <>
            <div className="mx-auto my-8 max-w-lg rounded-lg bg-green-50 p-6">
                <div>
                    <label htmlFor="groupName">모임방 이름</label>
                    <input
                        type="text"
                        placeholder="소모임의 이름을 적어주세요"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="my-2 block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 text-sm text-green-900 focus:border-green-500 focus:ring-green-500"
                    />
                </div>
                <CategorySelect onChange={handleCategoryChange} value={categoryName} />
                <div>
                    <label htmlFor="detail">모임설명</label>
                    <input
                        type="text"
                        placeholder="소모임의 설명을 적어주세요"
                        id="detail"
                        value={groupDetails}
                        onChange={(e) => setGroupDetails(e.target.value)}
                        className="my-2 block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 text-sm text-green-900 focus:border-green-500 focus:ring-green-500"
                    />
                </div>
                <div>
                    <button type="button" onClick={createGroup} className="rounded-lg bg-green-400 p-2 text-white">모임
                        개설하기
                    </button>
                    <button type="button" onClick={() => { route.back() }} className="mx-2 rounded-lg bg-green-400 p-2 text-white">뒤로가기
                    </button>
                </div>
                <div>
                </div>
            </div>
            <Alert message={'모임이 개설이 요청되었습니다.'} isOpen={isOpen} onClose={() => {
                setIsOpen(false)
            }} />
        </>
    )
}
