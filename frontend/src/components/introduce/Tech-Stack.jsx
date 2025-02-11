import FrontendStack from "@/components/introduce/FrontendStack";
import BackendStack from "@/components/introduce/BackendStack";
import DeploymentStack from "@/components/introduce/DeploymentStack";

export default function TechStack() {
  return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">사용된 기술 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FrontendStack/>
            <BackendStack/>
          </div>
          <div className="max-w-[50%] mx-auto">
            <DeploymentStack/>
          </div>
        </div>
      </section>
  )
}

