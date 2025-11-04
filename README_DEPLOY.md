# 배포 가이드

## 백엔드(FastAPI)
- 옵션 A: Docker 컨테이너 배포
  1) 루트에 `requirements.txt` 존재, `api/Dockerfile` 제공됨
  2) 이미지 빌드: `docker build -t options-api -f api/Dockerfile .`
  3) 실행: `docker run -p 8000:8000 options-api`

- 옵션 B: Render/Railway/Heroku 등
  - 루트 `Procfile` 제공: `web: uvicorn api.main:app --host 0.0.0.0 --port ${PORT}`
  - Python 환경 지정 후 `requirements.txt` 사용

## 프론트엔드(Vercel)
1) Vercel에서 New Project → `frontend` 폴더 선택
2) Framework: Vite, Build Command: `npm run build`, Output Dir: `dist`
3) 환경변수 추가: `VITE_API_BASE=https://<배포된-백엔드-도메인>`
4) 배포 완료 후 URL 접속

## 로컬 생산 빌드 점검
- 프론트: `cd frontend && npm run build && npm run preview`
- 백엔드: `uvicorn api.main:app --host 0.0.0.0 --port 8000`




