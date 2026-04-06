import { auth } from "@/auth";
import { protectServer } from "@/features/auth/utils";
import { Banner } from "./banner";
import { ProjectsSection } from "./projects-section";
import { TemplateSection } from "./template-section";
export default async function Home() {
  await protectServer();

  return (
    <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      <Banner />
      {/* <TemplateSection/> */}
      <ProjectsSection />
    </div>
  );
}
