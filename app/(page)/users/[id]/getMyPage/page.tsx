import UserProfile from "@/components/user/UserProfile";

interface PageProps {
  params: { id: string };
}

export default function GetMyPage({ params }: PageProps) {
  const userId = params.id;

  return (
    <div>
      <UserProfile />
    </div>
  );
}