export enum AuthStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

//외부에서 authStatus.PUBLIC으로 PUBLIC값 불러올 수 있음.
//모듈화, 오타,오류방지, 코드 가독성 향상
