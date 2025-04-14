import ctypes
import ctypes.wintypes as wintypes
import sys

PROCESS_ALL_ACCESS = 0x1F0FFF
kernel32 = ctypes.WinDLL('kernel32', use_last_error=True)

def inject(pid, dll_path):
    dll_path_bytes = dll_path.encode('utf-16le')
    dll_len = len(dll_path_bytes) + 2

    # Open the target process
    h_process = kernel32.OpenProcess(PROCESS_ALL_ACCESS, False, pid)
    if not h_process:
        print(f"[!] Failed to open process: {ctypes.get_last_error()}")
        return False

    # Allocate memory in the target process
    arg_address = kernel32.VirtualAllocEx(
        h_process, None, dll_len, 0x3000, 0x40
    )
    if not arg_address:
        print("[!] Failed to allocate memory.")
        return False

    # Write the DLL path to the process memory
    written = ctypes.c_size_t(0)
    if not kernel32.WriteProcessMemory(
        h_process, arg_address, dll_path_bytes, dll_len, ctypes.byref(written)
    ):
        print("[!] Failed to write to process memory.")
        return False

    # Get address of LoadLibraryW
    h_kernel32 = kernel32.GetModuleHandleW("kernel32.dll")
    loadlib_addr = kernel32.GetProcAddress(h_kernel32, b"LoadLibraryW")

    # Create remote thread to load the DLL
    thread_id = wintypes.DWORD()
    if not kernel32.CreateRemoteThread(
        h_process, None, 0, loadlib_addr, arg_address, 0, ctypes.byref(thread_id)
    ):
        print("[!] Failed to create remote thread.")
        return False

    print("[+] DLL injected successfully.")
    return True

# Usage:
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"Usage: python {sys.argv[0]} <pid> <dll_path>")
        sys.exit(1)

    pid = int(sys.argv[1])
    dll_path = sys.argv[2]
    inject(pid, dll_path)
