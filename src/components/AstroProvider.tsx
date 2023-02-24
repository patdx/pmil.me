import type { AstroGlobal } from 'astro';
import { createContext, useContext } from 'solid-js';

export const AstroContext = createContext<AstroGlobal>();

export const AstroProvider = AstroContext.Provider;

export const useAstro = () => useContext(AstroContext);
