import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    copyFiles,
    deleteFile,
    listDirectory,
    moveFiles,
    renameFile,
} from '../services/fileService';

export function useDirectoryList(path: string) {
  return useQuery({
    queryKey: ['directory', path],
    queryFn: () => listDirectory(path),
    staleTime: 5000,
  });
}

function invalidateDirectory(queryClient: ReturnType<typeof useQueryClient>, path: string) {
  queryClient.invalidateQueries({ queryKey: ['directory', path] });
}

export function useDeleteFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (path: string) => deleteFile(path),
    onSuccess: (_data, path) => {
      invalidateDirectory(qc, path);
    },
    onError: (error: unknown) => {
      console.error('Delete error:', error);
    },
  });
}

export function useRenameFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ path, newName }: { path: string; newName: string }) => renameFile(path, newName),
    onSuccess: (_data, variables) => {
      invalidateDirectory(qc, variables.path);
    },
    onError: (error: unknown) => {
      console.error('Rename error:', error);
    },
  });
}

export function useCopyFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sources, dest }: { sources: string[]; dest: string }) => copyFiles(sources, dest),
    onSuccess: (_data, variables) => {
      invalidateDirectory(qc, variables.dest);
    },
    onError: (error: unknown) => {
      console.error('Copy error:', error);
    },
  });
}

export function useMoveFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sources, dest }: { sources: string[]; dest: string }) => moveFiles(sources, dest),
    onSuccess: (_data, variables) => {
      invalidateDirectory(qc, variables.dest);
    },
    onError: (error: unknown) => {
      console.error('Move error:', error);
    },
  });
}
