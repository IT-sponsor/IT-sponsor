import Image from "next/image";
import LogoGray from "@/public/assets/logo_icon_gray.svg";
import FacebookIcon from "@/public/assets/facebook_icon.svg";
import InstagramIcon from "@/public/assets/insta_icon.svg";
import TwitterIcon from "@/public/assets/twitter_icon.svg";
import GitHubIcon from "@/public/assets/github_icon.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div>
          <div>
            <div className="flex justify-center text-teal-600">
              <Image className="h-8 w-auto" src={LogoGray} alt="Logo" />
              <span className="ml-2 text-gray text-2xl font-bold ">IT Rėmėjas</span>
            </div>

            <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
              Ši platforma skirta sujungti IT projektus su IT specialistais. Mūsų misija - skatinti bendradarbiavimą ir suteikti galimybę visiems prisidėti prie įvairių IT projektų.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}