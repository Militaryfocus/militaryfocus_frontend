import BannerBlog from '@/assets/img/blog-banner.png'
import ContainerDefault from '../Containers/ContainerDefault'

const Banner = () => {
    return (
        <div className='w-full py-[90px] relative overflow-hidden bg-cover bg-center' style={{ backgroundImage: `url(${BannerBlog.src})` }}>
            <ContainerDefault>
                <div className='max-w-[770px]'>
                    <h1 className='text-white text-[64px] font-bold font-russo-one max-[425px]:text-[30px]'>Военный блог</h1>
                    <p className='text-white text-[24px] font-normal max-[425px]:text-[16px]'>Узнайте о последних разработках, вооружении и операциях, влияющих на мировую безопасность</p>
                </div>
            </ContainerDefault>
        </div>
    )
}
export default Banner

