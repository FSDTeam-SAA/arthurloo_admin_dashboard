import React from "react";

const DashboardOverviewHeader = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="p-6" style={{ background: "#AC3AD41A" }}>
        <h1
          className="text-primary"
          style={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontStyle: "normal",
            fontSize: "24px",
            lineHeight: "150%",
            letterSpacing: "0%"
          }}
        >
          {title}
        </h1>
        <p className="text-sm font-normal text-primary leading-normal mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DashboardOverviewHeader;

















// "use client";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import React from "react";
// import admin from "../../../../public/assets/images/no-user.jpeg";
// import { UserProfileApiResponse } from "../settings/_components/user-data-type";
// import { useQuery } from "@tanstack/react-query";

// const DashboardOverviewHeader = () => {
//   const session = useSession();
//   const token = (session?.data?.user as { accessToken: string })?.accessToken;

//   // get api
//   const { data } = useQuery<UserProfileApiResponse>({
//     queryKey: ["profile-img"],
//     queryFn: () =>
//       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }).then((res) => res.json()),
//     enabled: !!token,
//   });

//   return (
//     <div className="sticky top-0  z-50">
//       {/* Header */}
//       <div className="bg-white p-6 flex items-center justify-end">
//         <div className="flex items-center gap-2">
//           <div>
//             <h1 className="text-base lg:text-lg font-bold text-[#191919] leading-normal text-right">
//               {data?.data?.name || "N/A"}
//             </h1>
//             <p className="text-sm font-normal text-[#191919] leading-normal text-right">
//               {data?.data?.email || "N/A"}
//             </p>
//           </div>
//           <div>
//             <Image
//               src={data?.data?.profileImage || admin}
//               alt={data?.data?.name || "Admin"}
//               width={200}
//               height={200}
//               className="w-12 h-12 rounded-full"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardOverviewHeader;
