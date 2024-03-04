import Image from "next/image";
import LogoGray from "@/public/assets/logo_icon_gray.svg";
import FacebookIcon from "@/public/assets/facebook_icon.svg";
import InstagramIcon from "@/public/assets/insta_icon.svg";
import TwitterIcon from "@/public/assets/twitter_icon.svg";
import GitHubIcon from "@/public/assets/github_icon.svg";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="relative mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <div className="flex justify-center text-teal-600 lg:justify-start">
              <Image className="h-8 w-auto" src={LogoGray} alt="Logo" />
              <span className="ml-2 text-gray text-2xl font-bold ">IT Rėmėjas</span>
            </div>

            <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
              Ši platforma skirta sujungti IT projektus su IT specialistais. Mūsų misija - skatinti bendradarbiavimą ir suteikti galimybę visiems prisidėti prie įvairių IT projektų.
            </p>
          </div>

          <ul
            className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12"
          >
            <li>
              <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> About </a>
            </li>

            <li>
              <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> Services </a>
            </li>

            <li>
              <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> Projects </a>
            </li>

            <li>
              <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> Blog </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}