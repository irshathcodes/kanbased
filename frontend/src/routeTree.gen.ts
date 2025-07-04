/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedLayoutImport } from './routes/_authenticated/_layout'
import { Route as AuthenticatedWorkspaceSettingsRouteImport } from './routes/_authenticated/workspace-settings/route'
import { Route as AuthenticatedSettingsRouteImport } from './routes/_authenticated/settings/route'
import { Route as AuthenticatedNewWorkspaceRouteImport } from './routes/_authenticated/new-workspace/route'
import { Route as authSignupRouteImport } from './routes/(auth)/signup/route'
import { Route as authResetPasswordRouteImport } from './routes/(auth)/reset-password/route'
import { Route as authLoginRouteImport } from './routes/(auth)/login/route'
import { Route as authForgotPasswordRouteImport } from './routes/(auth)/forgot-password/route'
import { Route as AuthenticatedLayoutIndexImport } from './routes/_authenticated/_layout/index'
import { Route as AuthenticatedAcceptInvitationInvitationIdRouteImport } from './routes/_authenticated/accept-invitation/$invitationId/route'
import { Route as AuthenticatedLayoutNotesRouteImport } from './routes/_authenticated/_layout/notes/route'
import { Route as AuthenticatedLayoutBoardsRouteImport } from './routes/_authenticated/_layout/boards/route'
import { Route as AuthenticatedLayoutNotesNoteIdRouteImport } from './routes/_authenticated/_layout/notes/$noteId/route'
import { Route as AuthenticatedLayoutBoardsBoardIdRouteImport } from './routes/_authenticated/_layout/boards_.$boardId/route'

// Create/Update Routes

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedLayoutRoute = AuthenticatedLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedWorkspaceSettingsRouteRoute =
  AuthenticatedWorkspaceSettingsRouteImport.update({
    id: '/workspace-settings',
    path: '/workspace-settings',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedSettingsRouteRoute = AuthenticatedSettingsRouteImport.update(
  {
    id: '/settings',
    path: '/settings',
    getParentRoute: () => AuthenticatedRoute,
  } as any,
)

const AuthenticatedNewWorkspaceRouteRoute =
  AuthenticatedNewWorkspaceRouteImport.update({
    id: '/new-workspace',
    path: '/new-workspace',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const authSignupRouteRoute = authSignupRouteImport.update({
  id: '/(auth)/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const authResetPasswordRouteRoute = authResetPasswordRouteImport.update({
  id: '/(auth)/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any)

const authLoginRouteRoute = authLoginRouteImport.update({
  id: '/(auth)/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const authForgotPasswordRouteRoute = authForgotPasswordRouteImport.update({
  id: '/(auth)/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedLayoutIndexRoute = AuthenticatedLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedLayoutRoute,
} as any)

const AuthenticatedAcceptInvitationInvitationIdRouteRoute =
  AuthenticatedAcceptInvitationInvitationIdRouteImport.update({
    id: '/accept-invitation/$invitationId',
    path: '/accept-invitation/$invitationId',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedLayoutNotesRouteRoute =
  AuthenticatedLayoutNotesRouteImport.update({
    id: '/notes',
    path: '/notes',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutBoardsRouteRoute =
  AuthenticatedLayoutBoardsRouteImport.update({
    id: '/boards',
    path: '/boards',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutNotesNoteIdRouteRoute =
  AuthenticatedLayoutNotesNoteIdRouteImport.update({
    id: '/$noteId',
    path: '/$noteId',
    getParentRoute: () => AuthenticatedLayoutNotesRouteRoute,
  } as any)

const AuthenticatedLayoutBoardsBoardIdRouteRoute =
  AuthenticatedLayoutBoardsBoardIdRouteImport.update({
    id: '/boards_/$boardId',
    path: '/boards/$boardId',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/forgot-password': {
      id: '/(auth)/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof authForgotPasswordRouteImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginRouteImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/reset-password': {
      id: '/(auth)/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof authResetPasswordRouteImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/signup': {
      id: '/(auth)/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authSignupRouteImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/new-workspace': {
      id: '/_authenticated/new-workspace'
      path: '/new-workspace'
      fullPath: '/new-workspace'
      preLoaderRoute: typeof AuthenticatedNewWorkspaceRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/settings': {
      id: '/_authenticated/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthenticatedSettingsRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/workspace-settings': {
      id: '/_authenticated/workspace-settings'
      path: '/workspace-settings'
      fullPath: '/workspace-settings'
      preLoaderRoute: typeof AuthenticatedWorkspaceSettingsRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/_layout': {
      id: '/_authenticated/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedLayoutImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/_layout/boards': {
      id: '/_authenticated/_layout/boards'
      path: '/boards'
      fullPath: '/boards'
      preLoaderRoute: typeof AuthenticatedLayoutBoardsRouteImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/notes': {
      id: '/_authenticated/_layout/notes'
      path: '/notes'
      fullPath: '/notes'
      preLoaderRoute: typeof AuthenticatedLayoutNotesRouteImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/accept-invitation/$invitationId': {
      id: '/_authenticated/accept-invitation/$invitationId'
      path: '/accept-invitation/$invitationId'
      fullPath: '/accept-invitation/$invitationId'
      preLoaderRoute: typeof AuthenticatedAcceptInvitationInvitationIdRouteImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/_layout/': {
      id: '/_authenticated/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedLayoutIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/boards_/$boardId': {
      id: '/_authenticated/_layout/boards_/$boardId'
      path: '/boards/$boardId'
      fullPath: '/boards/$boardId'
      preLoaderRoute: typeof AuthenticatedLayoutBoardsBoardIdRouteImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/notes/$noteId': {
      id: '/_authenticated/_layout/notes/$noteId'
      path: '/$noteId'
      fullPath: '/notes/$noteId'
      preLoaderRoute: typeof AuthenticatedLayoutNotesNoteIdRouteImport
      parentRoute: typeof AuthenticatedLayoutNotesRouteImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedLayoutNotesRouteRouteChildren {
  AuthenticatedLayoutNotesNoteIdRouteRoute: typeof AuthenticatedLayoutNotesNoteIdRouteRoute
}

const AuthenticatedLayoutNotesRouteRouteChildren: AuthenticatedLayoutNotesRouteRouteChildren =
  {
    AuthenticatedLayoutNotesNoteIdRouteRoute:
      AuthenticatedLayoutNotesNoteIdRouteRoute,
  }

const AuthenticatedLayoutNotesRouteRouteWithChildren =
  AuthenticatedLayoutNotesRouteRoute._addFileChildren(
    AuthenticatedLayoutNotesRouteRouteChildren,
  )

interface AuthenticatedLayoutRouteChildren {
  AuthenticatedLayoutBoardsRouteRoute: typeof AuthenticatedLayoutBoardsRouteRoute
  AuthenticatedLayoutNotesRouteRoute: typeof AuthenticatedLayoutNotesRouteRouteWithChildren
  AuthenticatedLayoutIndexRoute: typeof AuthenticatedLayoutIndexRoute
  AuthenticatedLayoutBoardsBoardIdRouteRoute: typeof AuthenticatedLayoutBoardsBoardIdRouteRoute
}

const AuthenticatedLayoutRouteChildren: AuthenticatedLayoutRouteChildren = {
  AuthenticatedLayoutBoardsRouteRoute: AuthenticatedLayoutBoardsRouteRoute,
  AuthenticatedLayoutNotesRouteRoute:
    AuthenticatedLayoutNotesRouteRouteWithChildren,
  AuthenticatedLayoutIndexRoute: AuthenticatedLayoutIndexRoute,
  AuthenticatedLayoutBoardsBoardIdRouteRoute:
    AuthenticatedLayoutBoardsBoardIdRouteRoute,
}

const AuthenticatedLayoutRouteWithChildren =
  AuthenticatedLayoutRoute._addFileChildren(AuthenticatedLayoutRouteChildren)

interface AuthenticatedRouteChildren {
  AuthenticatedNewWorkspaceRouteRoute: typeof AuthenticatedNewWorkspaceRouteRoute
  AuthenticatedSettingsRouteRoute: typeof AuthenticatedSettingsRouteRoute
  AuthenticatedWorkspaceSettingsRouteRoute: typeof AuthenticatedWorkspaceSettingsRouteRoute
  AuthenticatedLayoutRoute: typeof AuthenticatedLayoutRouteWithChildren
  AuthenticatedAcceptInvitationInvitationIdRouteRoute: typeof AuthenticatedAcceptInvitationInvitationIdRouteRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedNewWorkspaceRouteRoute: AuthenticatedNewWorkspaceRouteRoute,
  AuthenticatedSettingsRouteRoute: AuthenticatedSettingsRouteRoute,
  AuthenticatedWorkspaceSettingsRouteRoute:
    AuthenticatedWorkspaceSettingsRouteRoute,
  AuthenticatedLayoutRoute: AuthenticatedLayoutRouteWithChildren,
  AuthenticatedAcceptInvitationInvitationIdRouteRoute:
    AuthenticatedAcceptInvitationInvitationIdRouteRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AuthenticatedLayoutRouteWithChildren
  '/forgot-password': typeof authForgotPasswordRouteRoute
  '/login': typeof authLoginRouteRoute
  '/reset-password': typeof authResetPasswordRouteRoute
  '/signup': typeof authSignupRouteRoute
  '/new-workspace': typeof AuthenticatedNewWorkspaceRouteRoute
  '/settings': typeof AuthenticatedSettingsRouteRoute
  '/workspace-settings': typeof AuthenticatedWorkspaceSettingsRouteRoute
  '/boards': typeof AuthenticatedLayoutBoardsRouteRoute
  '/notes': typeof AuthenticatedLayoutNotesRouteRouteWithChildren
  '/accept-invitation/$invitationId': typeof AuthenticatedAcceptInvitationInvitationIdRouteRoute
  '/': typeof AuthenticatedLayoutIndexRoute
  '/boards/$boardId': typeof AuthenticatedLayoutBoardsBoardIdRouteRoute
  '/notes/$noteId': typeof AuthenticatedLayoutNotesNoteIdRouteRoute
}

export interface FileRoutesByTo {
  '': typeof AuthenticatedRouteWithChildren
  '/forgot-password': typeof authForgotPasswordRouteRoute
  '/login': typeof authLoginRouteRoute
  '/reset-password': typeof authResetPasswordRouteRoute
  '/signup': typeof authSignupRouteRoute
  '/new-workspace': typeof AuthenticatedNewWorkspaceRouteRoute
  '/settings': typeof AuthenticatedSettingsRouteRoute
  '/workspace-settings': typeof AuthenticatedWorkspaceSettingsRouteRoute
  '/boards': typeof AuthenticatedLayoutBoardsRouteRoute
  '/notes': typeof AuthenticatedLayoutNotesRouteRouteWithChildren
  '/accept-invitation/$invitationId': typeof AuthenticatedAcceptInvitationInvitationIdRouteRoute
  '/': typeof AuthenticatedLayoutIndexRoute
  '/boards/$boardId': typeof AuthenticatedLayoutBoardsBoardIdRouteRoute
  '/notes/$noteId': typeof AuthenticatedLayoutNotesNoteIdRouteRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/(auth)/forgot-password': typeof authForgotPasswordRouteRoute
  '/(auth)/login': typeof authLoginRouteRoute
  '/(auth)/reset-password': typeof authResetPasswordRouteRoute
  '/(auth)/signup': typeof authSignupRouteRoute
  '/_authenticated/new-workspace': typeof AuthenticatedNewWorkspaceRouteRoute
  '/_authenticated/settings': typeof AuthenticatedSettingsRouteRoute
  '/_authenticated/workspace-settings': typeof AuthenticatedWorkspaceSettingsRouteRoute
  '/_authenticated/_layout': typeof AuthenticatedLayoutRouteWithChildren
  '/_authenticated/_layout/boards': typeof AuthenticatedLayoutBoardsRouteRoute
  '/_authenticated/_layout/notes': typeof AuthenticatedLayoutNotesRouteRouteWithChildren
  '/_authenticated/accept-invitation/$invitationId': typeof AuthenticatedAcceptInvitationInvitationIdRouteRoute
  '/_authenticated/_layout/': typeof AuthenticatedLayoutIndexRoute
  '/_authenticated/_layout/boards_/$boardId': typeof AuthenticatedLayoutBoardsBoardIdRouteRoute
  '/_authenticated/_layout/notes/$noteId': typeof AuthenticatedLayoutNotesNoteIdRouteRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/forgot-password'
    | '/login'
    | '/reset-password'
    | '/signup'
    | '/new-workspace'
    | '/settings'
    | '/workspace-settings'
    | '/boards'
    | '/notes'
    | '/accept-invitation/$invitationId'
    | '/'
    | '/boards/$boardId'
    | '/notes/$noteId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/forgot-password'
    | '/login'
    | '/reset-password'
    | '/signup'
    | '/new-workspace'
    | '/settings'
    | '/workspace-settings'
    | '/boards'
    | '/notes'
    | '/accept-invitation/$invitationId'
    | '/'
    | '/boards/$boardId'
    | '/notes/$noteId'
  id:
    | '__root__'
    | '/_authenticated'
    | '/(auth)/forgot-password'
    | '/(auth)/login'
    | '/(auth)/reset-password'
    | '/(auth)/signup'
    | '/_authenticated/new-workspace'
    | '/_authenticated/settings'
    | '/_authenticated/workspace-settings'
    | '/_authenticated/_layout'
    | '/_authenticated/_layout/boards'
    | '/_authenticated/_layout/notes'
    | '/_authenticated/accept-invitation/$invitationId'
    | '/_authenticated/_layout/'
    | '/_authenticated/_layout/boards_/$boardId'
    | '/_authenticated/_layout/notes/$noteId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  authForgotPasswordRouteRoute: typeof authForgotPasswordRouteRoute
  authLoginRouteRoute: typeof authLoginRouteRoute
  authResetPasswordRouteRoute: typeof authResetPasswordRouteRoute
  authSignupRouteRoute: typeof authSignupRouteRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  authForgotPasswordRouteRoute: authForgotPasswordRouteRoute,
  authLoginRouteRoute: authLoginRouteRoute,
  authResetPasswordRouteRoute: authResetPasswordRouteRoute,
  authSignupRouteRoute: authSignupRouteRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/(auth)/forgot-password",
        "/(auth)/login",
        "/(auth)/reset-password",
        "/(auth)/signup"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/new-workspace",
        "/_authenticated/settings",
        "/_authenticated/workspace-settings",
        "/_authenticated/_layout",
        "/_authenticated/accept-invitation/$invitationId"
      ]
    },
    "/(auth)/forgot-password": {
      "filePath": "(auth)/forgot-password/route.tsx"
    },
    "/(auth)/login": {
      "filePath": "(auth)/login/route.tsx"
    },
    "/(auth)/reset-password": {
      "filePath": "(auth)/reset-password/route.tsx"
    },
    "/(auth)/signup": {
      "filePath": "(auth)/signup/route.tsx"
    },
    "/_authenticated/new-workspace": {
      "filePath": "_authenticated/new-workspace/route.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/settings": {
      "filePath": "_authenticated/settings/route.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/workspace-settings": {
      "filePath": "_authenticated/workspace-settings/route.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_layout": {
      "filePath": "_authenticated/_layout.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/_layout/boards",
        "/_authenticated/_layout/notes",
        "/_authenticated/_layout/",
        "/_authenticated/_layout/boards_/$boardId"
      ]
    },
    "/_authenticated/_layout/boards": {
      "filePath": "_authenticated/_layout/boards/route.tsx",
      "parent": "/_authenticated/_layout"
    },
    "/_authenticated/_layout/notes": {
      "filePath": "_authenticated/_layout/notes/route.tsx",
      "parent": "/_authenticated/_layout",
      "children": [
        "/_authenticated/_layout/notes/$noteId"
      ]
    },
    "/_authenticated/accept-invitation/$invitationId": {
      "filePath": "_authenticated/accept-invitation/$invitationId/route.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_layout/": {
      "filePath": "_authenticated/_layout/index.tsx",
      "parent": "/_authenticated/_layout"
    },
    "/_authenticated/_layout/boards_/$boardId": {
      "filePath": "_authenticated/_layout/boards_.$boardId/route.tsx",
      "parent": "/_authenticated/_layout"
    },
    "/_authenticated/_layout/notes/$noteId": {
      "filePath": "_authenticated/_layout/notes/$noteId/route.tsx",
      "parent": "/_authenticated/_layout/notes"
    }
  }
}
ROUTE_MANIFEST_END */
