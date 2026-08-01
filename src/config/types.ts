/**
 * SPPG Companion Configuration Types
 */

export type EnvironmentType =
  | 'development'
  | 'staging'
  | 'uat'
  | 'production'
  | 'demo'
  | 'testing';

export type ApplicationType =
  | 'BGN Simulator'
  | 'SIPGN'
  | 'RT Pintar'
  | 'Koperasi Merah Putih'
  | 'Smart Hospital'
  | string;

export type ThemeType = 'dark' | 'light' | 'system';
