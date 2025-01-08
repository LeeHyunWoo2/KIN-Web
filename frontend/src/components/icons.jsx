import * as React from 'react';

export const Icons = {
  naver: (props) => (
<svg width="800px" height="800px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path fill="#000000" d="M16 32C11.8333 32 8.125 33.5833 4.875 36.75C1.625 39.9167 0 43.6667 0 48V464C0 468.333 1.625 472.083 4.875 475.25C8.125 478.417 11.8333 480 16 480H432C436.167 480 439.875 478.417 443.125 475.25C446.375 472.083 448 468.333 448 464V48C448 43.6667 446.375 39.9167 443.125 36.75C439.875 33.5833 436.167 32 432 32H16ZM100.25 144H186.5L261.5 256V144H347.75V368H261.5L186.5 256V368H100.25V144Z">
  </path></svg>
  ),
  kakao: (props) => (
      <svg viewBox="0 0 512 512" version="1.1"
           xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
           strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path fill="#000000"
                d="M400,480l-352,0c-26.51,0 -48,-21.49 -48,-48l0,-352c0,-26.51 21.49,-48 48,-48l352,0c26.51,0 48,21.49 48,48l0,352c0,26.51 -21.49,48 -48,48Zm-95.732,-351.143c-24.583,-11.238 -51.339,-16.857 -80.268,-16.857c-28.929,0 -55.685,5.619 -80.268,16.857c-24.583,11.238 -44.018,26.519 -58.303,45.843c-14.286,19.325 -21.429,40.403 -21.429,63.236c0,22.119 6.756,42.603 20.268,61.452c13.512,18.848 31.756,33.981 54.732,45.397c-10.119,34.011 -15.536,53.336 -16.25,57.974l0,0.713c0,0.476 0.119,1.011 0.357,1.605c0.238,0.595 0.595,1.071 1.072,1.428c1.19,0.594 2.44,0.654 3.75,0.178c2.738,-0.357 25.297,-15.222 67.678,-44.595c9.762,1.308 19.226,1.962 28.393,1.962c29.048,0 55.833,-5.619 80.357,-16.857c24.524,-11.238 43.929,-26.548 58.214,-45.932c14.286,-19.384 21.429,-40.493 21.429,-63.325c0,-22.833 -7.143,-43.911 -21.429,-63.236c-14.285,-19.324 -33.72,-34.605 -58.303,-45.843Z"></path>
        </g>
      </svg>
  ),
  gitHub: (props) => (
      <svg viewBox="0 0 438.549 438.549" {...props}>
        <path
            fill="currentColor"
            d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  ),
  google: (props) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
};

export const logos = {
  react: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <g transform="matrix(.05696 0 0 .05696 .647744 2.43826)" fill="none"
           fillRule="evenodd">
          <circle r="50.167" cy="237.628" cx="269.529" fill="#00d8ff"/>
          <g stroke="#00d8ff" strokeWidth="24">
            <path
                d="M269.53 135.628c67.356 0 129.928 9.665 177.107 25.907 56.844 19.57 91.794 49.233 91.794 76.093 0 27.99-37.04 59.503-98.083 79.728-46.15 15.29-106.88 23.272-170.818 23.272-65.554 0-127.63-7.492-174.3-23.44-59.046-20.182-94.61-52.103-94.61-79.56 0-26.642 33.37-56.076 89.415-75.616 47.355-16.51 111.472-26.384 179.486-26.384z"/>
            <path
                d="M180.736 186.922c33.65-58.348 73.28-107.724 110.92-140.48C337.006 6.976 380.163-8.48 403.43 4.937c24.248 13.983 33.042 61.814 20.067 124.796-9.8 47.618-33.234 104.212-65.176 159.6-32.75 56.788-70.25 106.82-107.377 139.272-46.98 41.068-92.4 55.93-116.185 42.213-23.08-13.3-31.906-56.92-20.834-115.233 9.355-49.27 32.832-109.745 66.8-168.664z"/>
            <path
                d="M180.82 289.482C147.075 231.2 124.1 172.195 114.51 123.227c-11.544-59-3.382-104.11 19.864-117.566 24.224-14.024 70.055 2.244 118.14 44.94 36.356 32.28 73.688 80.837 105.723 136.173 32.844 56.733 57.46 114.21 67.036 162.582 12.117 61.213 2.31 107.984-21.453 121.74-23.057 13.348-65.25-.784-110.24-39.5-38.013-32.71-78.682-83.253-112.76-142.115z"/>
          </g>
        </g>
      </svg>
  ),
  next: (props) => (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Next.js</title>
        <path
            d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"/>
      </svg>
  ),
  tailwind: (props) => (
      <svg viewBox=".15 .13 799.7 479.69"
           xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="m400 .13c-106.63 0-173.27 53.3-199.93 159.89 39.99-53.3 86.64-73.28 139.95-59.96 30.42 7.6 52.16 29.67 76.23 54.09 39.2 39.78 84.57 85.82 183.68 85.82 106.62 0 173.27-53.3 199.92-159.9-39.98 53.3-86.63 73.29-139.95 59.97-30.41-7.6-52.15-29.67-76.22-54.09-39.2-39.78-84.58-85.82-183.68-85.82zm-199.93 239.84c-106.62 0-173.27 53.3-199.92 159.9 39.98-53.3 86.63-73.29 139.95-59.96 30.41 7.61 52.15 29.67 76.22 54.08 39.2 39.78 84.58 85.83 183.68 85.83 106.63 0 173.27-53.3 199.93-159.9-39.99 53.3-86.64 73.29-139.95 59.96-30.42-7.59-52.16-29.67-76.23-54.08-39.2-39.78-84.57-85.83-183.68-85.83z"
            fill="#06b6d4"/>
      </svg>
  ),
  shadcn: (props) => (
      <svg role="img" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>shadcn/ui</title>
        <path
            d="M22.219 11.784 11.784 22.219c-.407.407-.407 1.068 0 1.476.407.407 1.068.407 1.476 0L23.695 13.26c.407-.408.407-1.069 0-1.476-.408-.407-1.069-.407-1.476 0ZM20.132.305.305 20.132c-.407.407-.407 1.068 0 1.476.408.407 1.069.407 1.476 0L21.608 1.781c.407-.407.407-1.068 0-1.476-.408-.407-1.069-.407-1.476 0Z"/>
      </svg>
  ),
  jotai: (props) => (
      <svg viewBox="0 0 512 177" version="1.1"
           xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
        <title>Jotai</title>
        <path
            d="M74.9966962,9.40490258 L109.449853,9.40490258 L109.449853,124.325477 C109.703598,134.016906 107.251233,143.587261 102.368012,151.962362 C97.6198179,159.753429 90.7552584,166.034685 82.5742661,170.07417 C73.4273937,174.499068 63.3608148,176.689565 53.2023305,176.465532 C43.9306106,176.596862 34.7339046,174.787674 26.2028117,171.154151 C18.3770871,167.799903 11.7225947,162.199039 7.081841,155.060667 C2.36061367,147.872599 0,138.807842 0,127.866398 L34.6833163,127.866398 C34.7895439,134.399396 36.6839364,139.498322 40.3664937,143.110061 C44.29049,146.837616 49.5665825,148.800962 54.9727908,148.545374 C68.2158335,148.545374 74.8904686,140.472075 74.9966962,124.325477 L74.9966962,9.40490258 Z M185.898326,176.624951 C173.398877,176.624951 162.604971,173.95738 153.516608,168.622393 C144.483389,163.355303 137.171226,155.581902 132.465836,146.243775 C127.348699,135.883545 124.809859,124.440542 125.065312,112.888304 C124.800211,101.284038 127.338886,89.7871201 132.465836,79.3734917 C137.176254,70.0388865 144.48721,62.2667678 153.516608,56.9948741 C163.393404,51.4612147 174.580867,48.6964617 185.898326,48.9923938 C197.221183,48.6985306 208.413806,51.4630474 218.297749,56.9948741 C227.32251,62.2670443 234.627677,70.0395453 239.330817,79.3734917 C244.46322,89.7858231 247.007949,101.282651 246.749045,112.888304 C246.999002,124.442 244.454072,135.885078 239.330817,146.243775 C234.632713,155.581245 227.326338,163.355031 218.297749,168.622393 C209.197583,173.969183 198.397776,176.636676 185.898326,176.624951 Z M225.096316,9.40490258 L225.096316,27.9947352 L146.718041,27.9947352 L146.718041,9.40490258 L225.096316,9.40490258 Z M186.146191,150.06797 C193.856565,150.384283 201.115591,146.496148 205.131439,139.941762 L205.426503,139.445208 C209.793638,132.363367 211.977206,123.434346 211.977206,112.658144 C211.977206,102.24115 209.920239,93.5336983 205.806306,86.5357903 L205.373389,85.817967 C201.425146,78.964062 193.99621,74.8709843 186.093077,75.1952055 C178.324851,74.865608 170.999518,78.7525105 166.911332,85.3317746 L166.618014,85.817967 C162.21547,92.899808 160.014197,101.846534 160.014197,112.658144 C160.014197,123.109368 162.071164,131.801416 166.185097,138.73429 L166.618014,139.445208 C170.541161,146.136791 177.750838,150.187427 185.47726,150.083572 L186.146191,150.06797 Z M329.836745,50.6035126 L329.836745,76.3637093 L306.572897,76.3637093 L306.572897,136.311493 C306.572897,141.032721 307.646976,144.219549 309.795135,145.871979 C312.073102,147.515507 314.809409,148.391473 317.608808,148.382052 L318.169412,148.368328 C319.784878,148.370363 321.397034,148.222187 322.985064,147.925713 L326.685325,147.252938 L331.996706,172.76527 L330.675485,173.149517 C329.098913,173.594348 327.152455,174.097201 324.755524,174.641958 C321.43779,175.353142 318.066789,175.783453 314.678305,175.928704 L313.406874,175.969803 C300.954637,176.524547 290.963339,173.833448 283.432982,167.896504 C276.073768,162.094491 272.361261,153.316496 272.295461,141.562518 L272.296787,76.3637093 L255.388891,76.3637093 L255.388891,50.6035126 L272.296787,50.6035126 L272.296787,20.9837126 L306.572897,20.9837126 L306.572897,50.6035126 L329.836745,50.6035126 Z M382.419414,176.554055 C370.616346,176.554055 360.825701,173.467552 353.047479,167.294548 C345.269257,161.121543 341.380146,151.921051 341.380146,139.693072 C341.380146,130.474876 343.55191,123.233694 347.895439,117.969525 C352.403015,112.5923 358.328242,108.586945 364.998085,106.40842 C372.356774,103.91 379.989076,102.305076 387.730795,101.628177 C395.469462,101.014153 403.158535,99.884451 410.746778,98.246598 C415.373581,97.0662911 417.681081,94.4932222 417.669278,90.5273913 L417.669278,90.0316624 C417.928209,85.5723581 416.173848,81.2319405 412.889035,78.2049879 C409.678601,75.4312669 405.158025,74.0385048 399.32731,74.0267017 C394.113566,73.7545436 388.950162,75.1633088 384.59708,78.0456465 C381.095206,80.5316139 378.541926,84.1336732 377.355898,88.2612021 L345.646955,85.6940348 C347.761408,74.7977599 354.076028,65.1700305 363.227625,58.8892666 C372.599261,52.3031545 384.685603,49.0041969 399.486651,48.9923938 C408.25648,48.9235032 416.970072,50.3977422 425.229143,53.347726 C432.830117,55.9611937 439.542228,60.6608988 444.597978,66.9094515 C449.508055,73.0588501 451.963093,81.0377243 451.963093,90.8460741 L451.963093,174.217047 L419.457443,174.217047 L419.457443,157.078992 L418.501394,157.078992 C415.390976,162.917665 410.720553,167.778091 405.010487,171.118742 C399.026331,174.742284 391.495974,176.554055 382.419414,176.554055 Z M392.227764,152.883001 C399.011128,153.146608 405.637907,150.802528 410.746778,146.332298 C415.286978,142.37231 417.914361,136.670726 417.989336,130.666239 L417.987961,116.924954 C416.059096,118.068791 413.952804,118.882586 411.755941,119.33278 C408.923204,120.023259 405.931126,120.625216 402.726593,121.10324 L399.64337,121.57733 C397.667011,121.888144 395.845404,122.183221 394.157566,122.431085 C388.9935,122.99273 384.02698,124.731012 379.639792,127.512306 C375.998457,129.961911 373.908544,134.141738 374.13366,138.524569 C373.913856,142.702671 375.835203,146.705478 379.232586,149.14733 C382.859213,151.586342 387.125366,152.887358 391.485506,152.892913 L392.227764,152.883001 Z M494.018216,34.6706476 L493.409567,34.6693704 C488.556046,34.7486865 483.867193,32.9100452 480.361275,29.5527402 C476.846068,26.4488602 474.850208,21.9727069 474.890553,17.2834507 C474.851108,12.6045548 476.847719,8.13964187 480.361275,5.04957036 C487.78451,-1.68319012 499.105443,-1.68319012 506.528678,5.04957036 C510.042235,8.13964187 512.038845,12.6045548 511.9994,17.2834507 C512.038131,21.7851366 510.200296,26.0904269 506.943177,29.1737619 L506.528678,29.5527402 C503.148005,32.7805159 498.676932,34.6038472 494.018216,34.6706476 L494.018216,34.6706476 Z M476.253807,174.217047 L476.253807,50.6035126 L510.529918,50.6035126 L510.529918,174.217047 L476.253807,174.217047 Z"
              fill="#000000"></path>
      </svg>
  ),
  platejs: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           className="lucide lucide-minus size-24">
        <path d="M5 12h14"></path>
      </svg>
  ),
  pouchDB: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 330" {...props}>
        <g fillOpacity="0.9">
          <path fill="#6ccb94"
                d="M18.752 0L0 91.459l53.782 50.743l-34.943 62.289L89.94 329.677h77.785l71.406-125.186l-35.245-62.29l51.96-50.742L238.738 0L165.6 97.41H92.372z"/>
          <path fill="#5dbd85" d="m18.839 204.49l34.942-62.288l75.044 62.29z"/>
          <path fill="#64c48c" d="m53.782 142.203l75.044 62.29L92.371 97.41z"/>
          <path fill="#6ecc95"
                d="m239.13 204.49l-35.246-62.288l-75.056 62.29z"/>
          <path fill="#5ebe86" d="M89.94 329.677h77.784l-38.897-125.186z"/>
          <path fill="#76d29c"
                d="m203.884 142.203l-75.056 62.29L165.599 97.41z"/>
          <path fill="#74d09b"
                d="m238.74 0l17.102 91.46l-51.958 50.743l-38.286-44.793z"/>
          <path fill="#64c48c"
                d="m128.825 204.49l38.9 125.187l71.405-125.186z"/>
          <path fill="#58b880"
                d="M128.825 204.49L89.928 329.678L18.84 204.491z"/>
          <path fill="#5fbf87"
                d="M18.752 0L0 91.46l53.782 50.744L92.37 97.41z"/>
          <path fill="#6ecc95" d="m128.825 204.49l36.773-107.079H92.371z"/>
        </g>
      </svg>
  ),
  axios: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
        <path
            d="M55.4 22.08h-7.225l-4.25 7.055-4.122-7.055h-7.3l7.947 11.645-5.142 7.522-8.457-19.125h-6.375l10.54 23.714h7.947l4.972-7.522 4.93 7.522h6.502l-7.862-12.112z"
            fill="#fff"/>
        <path d="M14.82 59.725H0L24.47 4.223H39.4z" fill="#0a99e0"/>
        <path d="M49.137 59.725L64 59.778 39.4 4.222H24.47l24.668 55.502"
              fill="#222"/>
      </svg>
  ),
  nodejs: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <path
            d="M14.656.427c.8-.453 1.82-.455 2.6 0L29.2 7.16c.747.42 1.247 1.253 1.24 2.114v13.5c.005.897-.544 1.748-1.332 2.16l-11.88 6.702a2.6 2.6 0 0 1-2.639-.073l-3.565-2.06c-.243-.145-.516-.26-.688-.495.152-.204.422-.23.642-.32.496-.158.95-.4 1.406-.656.115-.08.256-.05.366.022l3.04 1.758c.217.125.437-.04.623-.145l11.665-6.583c.144-.07.224-.222.212-.38V9.334c.016-.18-.087-.344-.25-.417L16.19 2.244a.41.41 0 0 0-.465-.001L3.892 8.93c-.16.073-.27.235-.25.415v13.37c-.014.158.07.307.215.375l3.162 1.785c.594.32 1.323.5 1.977.265a1.5 1.5 0 0 0 .971-1.409l.003-13.29c-.014-.197.172-.36.363-.34h1.52c.2-.005.357.207.33.405L12.18 23.88c.001 1.188-.487 2.48-1.586 3.063-1.354.7-3.028.553-4.366-.12l-3.4-1.88c-.8-.4-1.337-1.264-1.332-2.16v-13.5a2.46 2.46 0 0 1 1.282-2.141L14.656.427zM18.1 9.785c1.727-.1 3.576-.066 5.13.785 1.203.652 1.87 2.02 1.892 3.358-.034.18-.222.28-.394.267-.5-.001-1.002.007-1.504-.003-.213.008-.336-.188-.363-.376-.144-.64-.493-1.273-1.095-1.582-.924-.463-1.996-.44-3.004-.43-.736.04-1.527.103-2.15.535-.48.328-.624 1-.453 1.522.16.383.603.506.964.62 2.082.544 4.287.5 6.33 1.207.845.292 1.672.86 1.962 1.745.378 1.186.213 2.604-.63 3.556-.684.784-1.68 1.2-2.675 1.442-1.323.295-2.695.302-4.038.17-1.263-.144-2.577-.476-3.552-1.336-.834-.724-1.24-1.852-1.2-2.94.01-.184.193-.312.37-.297h1.5c.202-.014.35.16.36.35.093.6.322 1.25.854 1.6 1.026.662 2.313.616 3.487.635.973-.043 2.065-.056 2.86-.7.42-.367.543-.98.43-1.508-.123-.446-.6-.653-1-.8-2.055-.65-4.285-.414-6.32-1.15-.826-.292-1.625-.844-1.942-1.693-.443-1.2-.24-2.687.693-3.607.9-.915 2.22-1.268 3.47-1.394z"/>
      </svg>
  ),
  expressjs: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <path
            d="M32 24.795c-1.164.296-1.884.013-2.53-.957l-4.594-6.356-.664-.88-5.365 7.257c-.613.873-1.256 1.253-2.4.944l6.87-9.222-6.396-8.33c1.1-.214 1.86-.105 2.535.88l4.765 6.435 4.8-6.4c.615-.873 1.276-1.205 2.38-.883l-2.48 3.288-3.36 4.375c-.4.5-.345.842.023 1.325L32 24.795zM.008 15.427l.562-2.764C2.1 7.193 8.37 4.92 12.694 8.3c2.527 1.988 3.155 4.8 3.03 7.95H1.48c-.214 5.67 3.867 9.092 9.07 7.346 1.825-.613 2.9-2.042 3.438-3.83.273-.896.725-1.036 1.567-.78-.43 2.236-1.4 4.104-3.45 5.273-3.063 1.75-7.435 1.184-9.735-1.248C1 21.6.434 19.812.18 17.9c-.04-.316-.12-.617-.18-.92q.008-.776.008-1.552zm1.498-.38h12.872c-.084-4.1-2.637-7.012-6.126-7.037-3.83-.03-6.58 2.813-6.746 7.037z"/>
      </svg>
  ),
  mongodb: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <path
            d="M15.9.087l.854 1.604c.192.296.4.558.645.802.715.715 1.394 1.464 2.004 2.266 1.447 1.9 2.423 4.01 3.12 6.292.418 1.394.645 2.824.662 4.27.07 4.323-1.412 8.035-4.4 11.12-.488.488-1.01.94-1.57 1.342-.296 0-.436-.227-.558-.436-.227-.383-.366-.82-.436-1.255-.105-.523-.174-1.046-.14-1.586v-.244C16.057 24.21 15.796.21 15.9.087z"
            fill="#599636"/>
        <path
            d="M15.9.034c-.035-.07-.07-.017-.105.017.017.35-.105.662-.296.96-.21.296-.488.523-.767.767-1.55 1.342-2.77 2.963-3.747 4.776-1.3 2.44-1.97 5.055-2.16 7.808-.087.993.314 4.497.627 5.508.854 2.684 2.388 4.933 4.375 6.885.488.47 1.01.906 1.55 1.325.157 0 .174-.14.21-.244a4.78 4.78 0 0 0 .157-.68l.35-2.614L15.9.034z"
            fill="#6cac48"/>
        <path
            d="M16.754 28.845c.035-.4.227-.732.436-1.063-.21-.087-.366-.26-.488-.453-.105-.174-.192-.383-.26-.575-.244-.732-.296-1.5-.366-2.248v-.453c-.087.07-.105.662-.105.75a17.37 17.37 0 0 1-.314 2.353c-.052.314-.087.627-.28.906 0 .035 0 .07.017.122.314.924.4 1.865.453 2.824v.35c0 .418-.017.33.33.47.14.052.296.07.436.174.105 0 .122-.087.122-.157l-.052-.575v-1.604c-.017-.28.035-.558.07-.82z"
            fill="#c2bfbf"/>
      </svg>
  ),
  redis: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <g transform="matrix(.848327 0 0 .848327 -7.883573 -9.449691)">
          <use xlinkHref="#B" fill="#a41e11"/>
          <path
              d="M45.536 34.95c-2.013 1.05-12.44 5.337-14.66 6.494s-3.453 1.146-5.207.308-12.85-5.32-14.85-6.276-2.04-1.613-.077-2.382l15.332-5.936c2.332-.836 3.14-.867 5.126-.14S43.55 31.87 45.51 32.6s2.037 1.31.024 2.36z"
              fill="#d82c20"/>
          <use xlinkHref="#B" y="-6.218" fill="#a41e11"/>
          <use xlinkHref="#C" fill="#d82c20"/>
          <path
              d="M45.536 26.098c-2.013 1.05-12.44 5.337-14.66 6.495s-3.453 1.146-5.207.308-12.85-5.32-14.85-6.276c-1-.478-1.524-.88-1.524-1.26V21.55s14.447-3.145 16.78-3.982 3.14-.867 5.126-.14 13.853 2.868 15.814 3.587v3.76c0 .377-.452.8-1.477 1.324z"
              fill="#a41e11"/>
          <use xlinkHref="#C" y="-6.449" fill="#d82c20"/>
          <g fill="#fff">
            <path
                d="M29.096 20.712l-1.182-1.965-3.774-.34 2.816-1.016-.845-1.56 2.636 1.03 2.486-.814-.672 1.612 2.534.95-3.268.34zM22.8 24.624l8.74-1.342-2.64 3.872z"/>
            <ellipse cx="20.444" rx="4.672" ry="1.811" cy="21.402"/>
          </g>
          <path d="M42.132 21.138l-5.17 2.042-.004-4.087z" fill="#7a0c00"/>
          <path d="M36.963 23.18l-.56.22-5.166-2.042 5.723-2.264z"
                fill="#ad2115"/>
        </g>
        <defs>
          <path id="B"
                d="M45.536 38.764c-2.013 1.05-12.44 5.337-14.66 6.494s-3.453 1.146-5.207.308-12.85-5.32-14.85-6.276c-1-.478-1.524-.88-1.524-1.26v-3.813s14.447-3.145 16.78-3.982 3.14-.867 5.126-.14 13.853 2.868 15.814 3.587v3.76c0 .377-.452.8-1.477 1.324z"/>
          <path id="C"
                d="M45.536 28.733c-2.013 1.05-12.44 5.337-14.66 6.494s-3.453 1.146-5.207.308-12.85-5.32-14.85-6.276-2.04-1.613-.077-2.382l15.332-5.935c2.332-.837 3.14-.867 5.126-.14s12.35 4.853 14.312 5.57 2.037 1.31.024 2.36z"/>
        </defs>
      </svg>
  ),
  passport: (props) => (
      <svg viewBox="-32 0 320 320" version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           preserveAspectRatio="xMidYMid" fill="#000000" stroke="#000000"
           strokeWidth="2" {...props}>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
           strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <path
                d="M128,0 C57.28,0 0,57.28 0,128 L64,128 C64,92.672 92.672,64 128,64 L128,0 L128,0 Z"
                fill="#D6FF00"></path>
            <path
                d="M256,128 C256,57.28 198.72,0 128,0 L128,64 C163.328,64 192,92.672 192,128 L256,128 L256,128 Z"
                fill="#34E27A"></path>
            <path
                d="M128,256 C198.72,256 256,198.72 256,128 L192,128 C192,163.328 163.328,192 128,192 L128,256 L128,256 Z"
                fill="#00B9F1"></path>
            <path
                d="M64,256 L64,128 L0,128 L0,320 L128,320 L128,256 L64,256 L64,256 Z"
                fill="#FFFFFF"></path>
          </g>
        </g>
      </svg>
  ),
  jwt: (props) => (
      <svg viewBox=".4 .3 99.7 100"
           xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" fillRule="evenodd">
          <path
              d="m57.8 27.2-.1-26.9h-15l.1 26.9 7.5 10.3zm-15 46.1v27h15v-27l-7.5-10.3z"
              fill="#fff"/>
          <path
              d="m57.8 73.3 15.8 21.8 12.1-8.8-15.8-21.8-12.1-3.9zm-15-46.1-15.9-21.8-12.1 8.8 15.8 21.8 12.2 3.9z"
              fill="#00f2e6"/>
          <path
              d="m30.6 36-25.6-8.3-4.6 14.2 25.6 8.4 12.1-4zm31.8 18.2 7.5 10.3 25.6 8.3 4.6-14.2-25.6-8.3z"
              fill="#00b9f1"/>
          <path
              d="m74.5 50.3 25.6-8.4-4.6-14.2-25.6 8.3-7.5 10.3zm-48.5 0-25.6 8.3 4.6 14.2 25.6-8.3 7.5-10.3z"
              fill="#d63aff"/>
          <path
              d="m30.6 64.5-15.8 21.8 12.1 8.8 15.9-21.8v-12.7zm39.3-28.5 15.8-21.8-12.1-8.8-15.8 21.8v12.7z"
              fill="#fb015b"/>
        </g>
      </svg>
  ),
  webSocket: (props) => (
      <svg viewBox="0 -31.5 256 256" version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           preserveAspectRatio="xMidYMid" fill="#000000" {...props}>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
           strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <path
                d="M192.440223,144.644612 L224.220111,144.644612 L224.220111,68.3393384 L188.415329,32.5345562 L165.943007,55.0068785 L192.440223,81.5040943 L192.440223,144.644612 L192.440223,144.644612 Z M224.303963,160.576482 L178.017688,160.576482 L113.451687,160.576482 L86.954471,134.079266 L98.1906322,122.843105 L120.075991,144.728464 L165.104487,144.728464 L120.746806,100.286931 L132.06682,88.9669178 L176.4245,133.324599 L176.4245,88.2961022 L154.622994,66.4945955 L165.775303,55.3422863 L110.684573,0 L56.3485097,0 L56.3485097,0 L0,0 L31.6960367,31.6960367 L31.6960367,31.7798886 L31.8637406,31.7798886 L97.4359646,31.7798886 L120.662954,55.0068785 L86.7029152,88.9669178 L63.4759253,65.7399279 L63.4759253,47.7117589 L31.6960367,47.7117589 L31.6960367,78.9046839 L86.7029152,133.911562 L64.3144448,156.300033 L100.119227,192.104815 L154.45529,192.104815 L256,192.104815 L256,192.104815 L224.303963,160.576482 L224.303963,160.576482 Z"
                fill="#231F20"></path>
          </g>
        </g>
      </svg>
  ),
  vercel: (props) => (
      <svg viewBox="0 0 64 64" fill="none"
           xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M31.9914 4L63.9828 59.4113H0L31.9914 4Z" fill="black"/>
      </svg>
  ),
  oracle: (props) => (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#F00" fillRule="evenodd"
              d="M7.957359,18.9123664 C4.11670252,18.9123664 1,15.803458 1,11.9617373 C1,8.12000773 4.11670252,5 7.957359,5 L16.0437948,5 C19.8855156,5 23,8.12000773 23,11.9617373 C23,15.803458 19.8855156,18.9123664 16.0437948,18.9123664 L7.957359,18.9123664 L7.957359,18.9123664 Z M15.8639176,16.4585488 C18.352201,16.4585488 20.3674397,14.448858 20.3674397,11.9617373 C20.3674397,9.47460595 18.352201,7.45381934 15.8639176,7.45381934 L8.1360824,7.45381934 C5.64895285,7.45381934 3.63255855,9.47460595 3.63255855,11.9617373 C3.63255855,14.448858 5.64895285,16.4585488 8.1360824,16.4585488 L15.8639176,16.4585488 L15.8639176,16.4585488 Z"/>
      </svg>
  ),
  cloudflare: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <path d="M8.16 23h21.177v-5.86l-4.023-2.307-.694-.3-16.46.113z"
              fill="#fff"/>
        <path
            d="M22.012 22.222c.197-.675.122-1.294-.206-1.754-.3-.422-.807-.666-1.416-.694l-11.545-.15c-.075 0-.14-.038-.178-.094s-.047-.13-.028-.206c.038-.113.15-.197.272-.206l11.648-.15c1.38-.066 2.88-1.182 3.404-2.55l.666-1.735a.38.38 0 0 0 .02-.225c-.75-3.395-3.78-5.927-7.4-5.927-3.34 0-6.17 2.157-7.184 5.15-.657-.488-1.5-.75-2.392-.666-1.604.16-2.9 1.444-3.048 3.048a3.58 3.58 0 0 0 .084 1.191A4.84 4.84 0 0 0 0 22.1c0 .234.02.47.047.703.02.113.113.197.225.197H21.58a.29.29 0 0 0 .272-.206l.16-.572z"
            fill="#f38020"/>
        <path
            d="M25.688 14.803l-.32.01c-.075 0-.14.056-.17.13l-.45 1.566c-.197.675-.122 1.294.206 1.754.3.422.807.666 1.416.694l2.457.15c.075 0 .14.038.178.094s.047.14.028.206c-.038.113-.15.197-.272.206l-2.56.15c-1.388.066-2.88 1.182-3.404 2.55l-.188.478c-.038.094.028.188.13.188h8.797a.23.23 0 0 0 .225-.169A6.41 6.41 0 0 0 32 21.106a6.32 6.32 0 0 0-6.312-6.302"
            fill="#faae40"/>
      </svg>
  ),
  ubuntu: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <path
            d="M32 16c0 8.836-7.164 16-16 16S0 24.836 0 16 7.164 0 16 0s16 7.164 16 16z"
            fill="#dd4814"/>
        <path
            d="M5.12 13.864c-1.18 0-2.137.956-2.137 2.137s.956 2.136 2.137 2.136S7.257 17.18 7.257 16 6.3 13.864 5.12 13.864zm15.252 9.71c-1.022.6-1.372 1.896-.782 2.917s1.895 1.372 2.917.782 1.372-1.895.782-2.917-1.896-1.37-2.917-.782zM9.76 16a6.23 6.23 0 0 1 2.653-5.105L10.852 8.28a9.3 9.3 0 0 0-3.838 5.394C7.69 14.224 8.12 15.06 8.12 16s-.432 1.776-1.106 2.326c.577 2.237 1.968 4.146 3.838 5.395l1.562-2.616A6.23 6.23 0 0 1 9.761 16zM16 9.76a6.24 6.24 0 0 1 6.215 5.687l3.044-.045a9.25 9.25 0 0 0-2.757-6.019c-.812.307-1.75.26-2.56-.208a2.99 2.99 0 0 1-1.461-2.118C17.7 6.84 16.86 6.72 16 6.72c-1.477 0-2.873.347-4.113.96l1.484 2.66c.8-.372 1.69-.58 2.628-.58zm0 12.48c-.94 0-1.83-.21-2.628-.58l-1.484 2.66c1.24.614 2.636.96 4.113.96a9.28 9.28 0 0 0 2.479-.338c.14-.858.65-1.648 1.46-2.118s1.75-.514 2.56-.207a9.25 9.25 0 0 0 2.757-6.019l-3.045-.045A6.24 6.24 0 0 1 16 22.24zm4.372-13.813c1.022.6 2.328.24 2.917-.78s.24-2.328-.78-2.918-2.328-.24-2.918.783-.24 2.327.782 2.917z"
            fill="#fff"/>
      </svg>
  ),
}