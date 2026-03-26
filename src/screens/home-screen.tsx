import { CartContainer } from '@/containers/cart'
import { Layout } from '@/layout/layout'
import { LinearGradient } from '@/components/gradient'
import { useProductCategoryFindAll } from '@/shared/query/product-category/use-product-category-find-all.query'
import { useProductsFindAllInfinite } from '@/shared/query/products/use-products-find-all.query'
import { Product } from '@/shared/types/api'
import { Link, useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

type TProduct = Product

// ─── Design tokens (DESIGN.md) ────────────────────────────────────────────────
const C = {
  surface: '#060e20',
  surfaceContainer: '#0f1930',
  surfaceContainerHigh: '#141f38',
  primary: '#90abff',
  primaryDim: '#316bf3',
  tertiary: '#ffa7eb',
  text: '#e8eeff',
  textSecondary: '#c8d0e0',
  outline: '#40485d',
} as const

const getPrice = (product: TProduct): string => {
  const price = product.variants?.[0]?.price
  return price != null ? `$${Number(price).toFixed(2)}` : ''
}

const imageUri = (seed: string, w = 200, h = 200) =>
  `https://picsum.photos/${w}/${h}?random=${encodeURIComponent(seed)}`

// ─── HeroCard ─────────────────────────────────────────────────────────────────
const HeroCard = ({ product }: { product: TProduct }) => (
  <Link screen="ProductDetail" params={{ id: product.id }}>
    <View style={{ borderRadius: 20, overflow: 'hidden', height: 220, marginBottom: 12 }}>
      <ImageBackground
        source={{ uri: imageUri(product.name, 400, 300) }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(6,14,32,0.82)', C.surface]}
          style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}
        >
          {/* NEW ARRIVAL badge */}
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(144,171,255,0.12)',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: 'rgba(144,171,255,0.25)',
            }}
          >
            <Text style={{ color: C.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>
              NEW ARRIVAL
            </Text>
          </View>

          <Text style={{ color: C.text, fontSize: 24, fontWeight: '900', marginBottom: 4 }}>
            {product.name}
          </Text>
          <Text
            style={{ color: C.textSecondary, fontSize: 12, marginBottom: 12 }}
            numberOfLines={2}
          >
            {product.description}
          </Text>

          {/* CTA button */}
          <LinearGradient
            colors={[C.primary, C.primaryDim]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 24, alignSelf: 'flex-start' }}
          >
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                {`Shop Now${product.variants?.[0]?.price ? ` — $${product.variants[0].price}` : ''}`}
              </Text>
            </View>
          </LinearGradient>
        </LinearGradient>
      </ImageBackground>
    </View>
  </Link>
)

// ─── TrendingRow ──────────────────────────────────────────────────────────────
const TrendingRow = ({ product }: { product: TProduct }) => (
  <Link screen="ProductDetail" params={{ id: product.id }}>
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: C.surfaceContainer,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 10,
        height: 80,
        alignItems: 'center',
      }}
    >
      <ImageBackground
        source={{ uri: imageUri(product.name + '-trending', 80, 80) }}
        style={{ width: 80, height: 80 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, paddingHorizontal: 14 }}>
        <Text style={{ color: C.text, fontWeight: '700', fontSize: 15 }}>{product.name}</Text>
        <Text style={{ color: C.primary, fontWeight: '600', fontSize: 14, marginTop: 2 }}>
          {getPrice(product)}
        </Text>
      </View>
    </View>
  </Link>
)

// ─── CuratedCard ──────────────────────────────────────────────────────────────
const CuratedCard = ({ product, staggered }: { product: TProduct; staggered: boolean }) => (
  <Link screen="ProductDetail" params={{ id: product.id }} className="w-1/2">
    <View style={{ padding: 6, paddingTop: staggered ? 24 : 6, width: '100%' }}>
      <View style={{ backgroundColor: C.surfaceContainer, borderRadius: 20, overflow: 'hidden' }}>
        <View>
          <ImageBackground
            source={{ uri: imageUri(product.name + '-grid', 200, 160) }}
            style={{ width: '100%', height: 160 }}
            resizeMode="cover"
          />
          {/* Favourite overlay */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(15,25,48,0.72)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: C.textSecondary, fontSize: 16 }}>♡</Text>
          </View>
        </View>
        <View style={{ padding: 12 }}>
          <Text
            style={{ color: C.text, fontWeight: '700', fontSize: 14 }}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text
            style={{ color: C.textSecondary, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {product.category?.name}
          </Text>
          <Text style={{ color: C.primary, fontWeight: '700', fontSize: 15, marginTop: 6 }}>
            {getPrice(product)}
          </Text>
        </View>
      </View>
    </View>
  </Link>
)

// ─── HomeHeader ───────────────────────────────────────────────────────────────
type HomeHeaderProps = {
  hero: TProduct | undefined
  trending: TProduct[]
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (cat: string | null) => void
}

const HomeHeader = ({
  hero,
  trending,
  categories,
  selectedCategory,
  onSelectCategory,
}: HomeHeaderProps) => (
  <View>
    {/* Trending Now */}
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <Text style={{ color: C.text, fontSize: 22, fontWeight: '800' }}>Trending Now</Text>
        <Text style={{ color: C.primary, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 }}>
          VIEW ALL
        </Text>
      </View>
      {hero && <HeroCard product={hero} />}
      {trending.map((p) => (
        <TrendingRow key={p.id} product={p} />
      ))}
    </View>

    {/* Category Tabs */}
    <View style={{ marginVertical: 16 }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(c) => c}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const active = item === (selectedCategory ?? 'All')
          return (
            <TouchableOpacity
              onPress={() => onSelectCategory(item === 'All' ? null : item)}
              style={{
                backgroundColor: active ? C.primary : C.surfaceContainerHigh,
                borderRadius: 24,
                paddingHorizontal: 18,
                paddingVertical: 8,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: active ? C.surface : C.textSecondary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>

    {/* Curated Essentials heading */}
    <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
      <Text style={{ color: C.text, fontSize: 22, fontWeight: '800' }}>Curated Essentials</Text>
    </View>
  </View>
)

// ─── HomeFooter ───────────────────────────────────────────────────────────────
type HomeFooterProps = {
  isFetchingNextPage: boolean
  email: string
  onEmailChange: (v: string) => void
}

const HomeFooter = ({ isFetchingNextPage, email, onEmailChange }: HomeFooterProps) => (
  <View>
    {isFetchingNextPage && (
      <ActivityIndicator size="large" color={C.primary} style={{ marginVertical: 16 }} />
    )}

    {/* Newsletter */}
    <View
      style={{
        margin: 16,
        marginTop: 24,
        backgroundColor: C.surfaceContainer,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: C.tertiary,
          fontSize: 22,
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Join the Inner Circle
      </Text>
      <Text
        style={{ color: C.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 20 }}
      >
        Get exclusive access to limited drops and 15% off your first neon-powered purchase.
      </Text>
      <TextInput
        placeholder="Email address"
        placeholderTextColor={C.outline}
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          width: '100%',
          backgroundColor: C.surfaceContainerHigh,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: C.text,
          fontSize: 14,
          marginBottom: 12,
        }}
      />
      <LinearGradient
        colors={[C.primary, C.primaryDim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 24, width: '100%' }}
      >
        <TouchableOpacity style={{ paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Join</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>

    <View style={{ height: 120 }} />
  </View>
)

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export const HomeScreen = () => {
  const { data, isLoading, isRefetching, error, refetch, fetchNextPage, isFetchingNextPage } =
    useProductsFindAllInfinite()
  const { data: categoryData } = useProductCategoryFindAll()

  const products = data?.pages.flatMap((page) => page.data) || []

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const { setOptions } = useNavigation()

  useFocusEffect(
    useCallback(() => {
      setOptions({ headerRight: () => <CartContainer /> } as StackNavigationOptions)
    }, [])
  )

  const categories = useMemo(() => {
    const apiCats = (categoryData as any)?.map?.((c: any) => c.name as string).filter(Boolean) ?? []
    if (apiCats.length > 0) return ['All', ...apiCats]
    // Fallback: derive from loaded products
    const fromProducts = Array.from(
      new Set(products.map((p) => p.category?.name).filter(Boolean) as string[])
    )
    return ['All', ...fromProducts]
  }, [categoryData, products])

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter((p) => p.category?.name === selectedCategory)
  }, [products, selectedCategory])

  const hero = products[0]
  const trendingSide = products.slice(1, 3)

  const renderItem = useCallback(
    ({ item, index }: { item: TProduct; index: number }) => (
      <CuratedCard product={item} staggered={index % 2 !== 0} />
    ),
    []
  )

  if (error) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.surface }}
      >
        <Text style={{ color: C.text, marginBottom: 12 }}>Error: {String(error)}</Text>
        <Pressable
          onPress={() => refetch()}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: C.primary,
            borderRadius: 24,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Reload</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <Layout>
      <FlatList
        key={selectedCategory ?? 'all'}
        numColumns={2}
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <HomeHeader
            hero={hero}
            trending={trendingSide}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        }
        ListFooterComponent={
          <HomeFooter
            isFetchingNextPage={isFetchingNextPage}
            email={email}
            onEmailChange={setEmail}
          />
        }
        refreshing={isLoading || isRefetching}
        onRefresh={() => refetch()}
        onEndReachedThreshold={0.2}
        onEndReached={() => fetchNextPage()}
        contentContainerStyle={{ paddingTop: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  )
}
