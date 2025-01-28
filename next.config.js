/** @type {import('next').NextConfig} */
const nextConfig = {

    output: 'standalone',
    images: {
        domains: ['images.unsplash.com', "95.163.233.125", "militaryfocus.ru"],
    },
}

module.exports = nextConfig 