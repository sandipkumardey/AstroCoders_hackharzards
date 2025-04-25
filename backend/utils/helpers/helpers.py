import hashlib

def md5_hash(text: str) -> str:
    """
    Returns the MD5 hash of the given string.
    """
    return hashlib.md5(text.encode('utf-8')).hexdigest()