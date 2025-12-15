import tkinter as tk
import threading

blocker_window = None
countdown_label = None

# ✅ 전체화면 차단 GUI 실행
def show_black_screen_gui():
    global blocker_window, countdown_label

    # ❗ 중복 방지: Tk 상태 함수 사용 X
    if blocker_window:
        return

    def run_blocker():
        global blocker_window, countdown_label

        root = tk.Tk()
        root.withdraw()
        blocker_window = tk.Toplevel(root)
        blocker_window.attributes('-fullscreen', True)
        blocker_window.configure(bg='black')
        blocker_window.title("BLOCKED")

        label = tk.Label(blocker_window, text="📵 전자기기 탐지됨\n접근 금지",
                         font=("Helvetica", 52, "bold"), fg="white", bg="black")
        label.pack(expand=True)

        countdown_label = tk.Label(blocker_window,
                                   font=("Helvetica", 48, "bold"), fg="yellow", bg="black")
        countdown_label.pack(pady=40)

        # ✅ 카운트다운 → 이후 메시지 유지
        def countdown(i=15):
            if i <= 0:
                countdown_label.config(
                    text="📢 관리자에게 알림 전송 중...",
                    font=("Helvetica", 52, "bold"),
                    fg="red"
                )
                blocker_window.after(3000, lambda: countdown_label.config(
                    text="📢 여전히 차단 중...",
                    font=("Helvetica", 48, "bold"),
                    fg="orange"
                ))
                return
            countdown_label.config(text=f"⏳ {i}초 후 알림 전송...")
            blocker_window.after(1000, countdown, i - 1)

        countdown()

        blocker_window.protocol("WM_DELETE_WINDOW", lambda: None)
        blocker_window.mainloop()

    threading.Thread(target=run_blocker, daemon=True).start()

# ✅ 차단 해제 (GUI 종료)
def hide_black_screen_gui():
    global blocker_window
    try:
        if blocker_window:
            blocker_window.destroy()
    except Exception as e:
        print(f"[❌ 차단 해제 실패] {e}")
    finally:
        blocker_window = None
