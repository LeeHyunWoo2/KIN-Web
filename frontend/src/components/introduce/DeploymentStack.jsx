import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";
import { logos } from "@/components/icons";

const technologies = {
  deployment: [
    { name: "Vercel", description: "프론트엔드 배포 플랫폼", icon: "vercel" , url: "https://vercel.com/"},
    { name: "Oracle Cloud", description: "API 요청 처리 백엔드 서버", icon: "oracle", url: "https://www.oracle.com/cloud/"},
    { name: "Ubuntu", description: "백엔드 서버 운영 환경", icon: "ubuntu" , url: "https://ubuntu.com/"},
    { name: "Cloudflare", description: "DNS 레코드 설정, SSL 인증 및 네트워크 보안.", icon: "cloudflare", url: "https://www.cloudflare.com/"},
  ]
};

const DeploymentStack = () => (
    <Card className="mt-8 mx-auto">
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <Cloud className="mr-2" />
          Deploy & Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
          {technologies.deployment.map((tech) => (
              <div key={tech.name} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <a href={tech.url} target="_blank" rel="noreferrer" className="block">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                      {logos[tech.icon] ? logos[tech.icon]({ className: "w-5 h-5" }) : null}
                    </div>
                    <h4 className="font-medium">{tech.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </a>
              </div>
          ))}
        </div>
      </CardContent>
    </Card>
);

export default DeploymentStack;