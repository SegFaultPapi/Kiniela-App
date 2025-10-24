import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { supabase } from './supabase'

// Inicializar tRPC
const t = initTRPC.create()

// Exportar funciones básicas
export const router = t.router
export const publicProcedure = t.procedure

// Router con Supabase integrado
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}!`,
      }
    }),
  
  getMarkets: publicProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw new Error(`Error fetching markets: ${error.message}`)
      }
      
      return data || []
    }),

  getMarketById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('id', input.id)
        .single()
      
      if (error) {
        throw new Error(`Error fetching market: ${error.message}`)
      }
      
      return data
    }),

  createMarket: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.string(),
      outcome_a: z.string(),
      outcome_b: z.string(),
      end_date: z.string(),
      creator_id: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('markets')
        .insert([{
          ...input,
          creator_id: input.creator_id || null,
        }])
        .select()
        .single()
      
      if (error) {
        throw new Error(`Error creating market: ${error.message}`)
      }
      
      return data
    }),

  getUsers: publicProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw new Error(`Error fetching users: ${error.message}`)
      }
      
      return data || []
    }),

  createUser: publicProcedure
    .input(z.object({
      fid: z.number().optional(),
      address: z.string().optional(),
      display_name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .insert([input])
        .select()
        .single()
      
      if (error) {
        throw new Error(`Error creating user: ${error.message}`)
      }
      
      return data
    }),

  // UPDATE operations
  updateMarket: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      outcome_a: z.string().optional(),
      outcome_b: z.string().optional(),
      end_date: z.string().optional(),
      status: z.enum(['active', 'resolved', 'cancelled']).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      const { data, error } = await supabase
        .from('markets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw new Error(`Error updating market: ${error.message}`)
      }
      
      return data
    }),

  updateUser: publicProcedure
    .input(z.object({
      id: z.string(),
      fid: z.number().optional(),
      address: z.string().optional(),
      display_name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw new Error(`Error updating user: ${error.message}`)
      }
      
      return data
    }),

  // DELETE operations
  deleteMarket: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('markets')
        .delete()
        .eq('id', input.id)
        .select()
        .single()
      
      if (error) {
        throw new Error(`Error deleting market: ${error.message}`)
      }
      
      return data
    }),

  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', input.id)
        .select()
        .single()
      
      if (error) {
        throw new Error(`Error deleting user: ${error.message}`)
      }
      
      return data
    }),

  // Additional useful queries
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', input.id)
        .single()
      
      if (error) {
        throw new Error(`Error fetching user: ${error.message}`)
      }
      
      return data
    }),

  getMarketsByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('category', input.category)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw new Error(`Error fetching markets by category: ${error.message}`)
      }
      
      return data || []
    }),
})

export type AppRouter = typeof appRouter
