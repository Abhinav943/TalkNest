import { useEffect, useState, useRef } from "react";
import { LogOutIcon, PaletteIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const THEMES = [
  { id: "cuteClean", label: "Cute / Clean" },
  { id: "vibrantFlashy", label: "Vibrant / Flashy" },
  { id: "whatsappClean", label: "WhatsApp / Clean" },
];

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("talknest-theme") || "cuteClean");

  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("talknest-theme", theme);
  }, [theme]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-5 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group ring-1 ring-white/10 hover:ring-white/20 transition"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-100 font-semibold text-base max-w-[190px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-slate-300/70 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* THEME */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-sm rounded-xl hover:bg-white/10 text-slate-300/70 hover:text-slate-100" tabIndex={0}>
              <PaletteIcon className="size-5" />
            </button>
            <div tabIndex={0} className="dropdown-content z-[1] mt-2 w-56 glass-panel rounded-2xl p-2">
              <p className="px-3 py-2 text-xs text-slate-300/70">Theme</p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={[
                    "w-full text-left px-3 py-2 rounded-xl text-sm interactive tap hover:bg-white/10",
                    theme === t.id ? "bg-white/10 border border-white/10 text-slate-100" : "text-slate-200/85",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* LOGOUT BTN */}
          <button
            className="text-slate-300/70 hover:text-slate-100 transition-colors"
            onClick={() => logout()}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-300/70 hover:text-slate-100 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
